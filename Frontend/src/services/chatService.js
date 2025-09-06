import { backendApi } from './backendApi';
import { firestore, auth } from './firebase';
import { 
    collection, 
    addDoc, 
    query, 
    orderBy, 
    onSnapshot, 
    where,
    serverTimestamp
} from 'firebase/firestore';

let currentChatId = null;

// Create new chat session (this will be called when user uploads a file)
export const createNewChat = async (file) => {
    try {
        const response = await backendApi.uploadFile(file);
        currentChatId = response.chat_id;
        
        // Also save to Firestore for UI purposes
        const user = auth.currentUser;
        if (user) {
            await addDoc(collection(firestore, 'chatSessions'), {
                userId: user.uid,
                chatId: currentChatId,
                fileName: file.name,
                createdAt: serverTimestamp(),
                lastMessage: 'File uploaded successfully'
            });
        }
        
        return { success: true, chatId: currentChatId, message: response.msg };
    } catch (error) {
        console.error('Error creating new chat:', error);
        return { success: false, error: error.message };
    }
};

// Get current chat ID
export const getCurrentChatId = () => {
    return currentChatId;
};

// Set current chat ID (when user selects a conversation)
export const setCurrentChatId = (chatId) => {
    currentChatId = chatId;
};

// Send message to backend
export const sendMessageToBackend = async (message) => {
    try {
        if (!currentChatId) {
            throw new Error('No active chat session. Please upload a file first.');
        }

        const response = await backendApi.sendMessage(currentChatId, message);
        return { success: true, answer: response.answer };
    } catch (error) {
        console.error('Error sending message:', error);
        return { success: false, error: error.message };
    }
};

// Save chat message to Firestore for UI
export const saveChatMessage = async (message, response) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        const chatData = {
            userId: user.uid,
            userEmail: user.email,
            message: message,
            response: response,
            timestamp: serverTimestamp(),
            chatId: currentChatId,
            type: 'backend_chat'
        };

        const docRef = await addDoc(collection(firestore, 'chatMessages'), chatData);
        console.log('Message saved with ID:', docRef.id);
        return { id: docRef.id, ...chatData };
    } catch (error) {
        console.error('Error saving chat message:', error);
        throw error;
    }
};

// Get current chat history from Firestore
export const getCurrentChatHistory = (callback) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        if (!currentChatId) {
            callback([]);
            return () => {};
        }

        const q = query(
            collection(firestore, 'chatMessages'),
            where('userId', '==', user.uid),
            where('chatId', '==', currentChatId),
            orderBy('timestamp', 'asc')
        );

        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(messages);
        });
    } catch (error) {
        console.error('Error getting current chat history:', error);
        throw error;
    }
};

// Get all chat sessions from Firestore
export const getAllConversations = (callback) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        const q = query(
            collection(firestore, 'chatSessions'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
        );

        return onSnapshot(q, (snapshot) => {
            const conversations = snapshot.docs.map(doc => ({
                id: doc.data().chatId,
                fileName: doc.data().fileName,
                lastMessage: doc.data().lastMessage,
                timestamp: doc.data().createdAt,
                messageCount: 1 // You can calculate this separately if needed
            }));
            callback(conversations);
        });
    } catch (error) {
        console.error('Error getting all conversations:', error);
        throw error;
    }
};

// Load specific conversation
export const loadConversation = (chatId, callback) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        currentChatId = chatId;

        const q = query(
            collection(firestore, 'chatMessages'),
            where('userId', '==', user.uid),
            where('chatId', '==', chatId),
            orderBy('timestamp', 'asc')
        );

        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(messages);
        });
    } catch (error) {
        console.error('Error loading conversation:', error);
        throw error;
    }
};

// Create new conversation (for UI purposes)
export const createNewConversation = () => {
    currentChatId = null;
    return currentChatId;
};