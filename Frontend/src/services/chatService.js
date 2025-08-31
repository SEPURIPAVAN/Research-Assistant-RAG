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

let currentConversationId = null;


export const createNewConversation = () => {
    currentConversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return currentConversationId;
};

export const getCurrentConversationId = () => {
    if (!currentConversationId) {
        currentConversationId = createNewConversation();
    }
    return currentConversationId;
};


export const saveChatMessage = async (message, response) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        const conversationId = getCurrentConversationId();

        const chatData = {
            userId: user.uid,
            userEmail: user.email,
            message: message,
            response: response,
            timestamp: serverTimestamp(),
            conversationId: conversationId 
        };

        const docRef = await addDoc(collection(firestore, 'chatMessages'), chatData);
        console.log('Message saved with ID:', docRef.id);
        return { id: docRef.id, ...chatData };
    } catch (error) {
        console.error('Error saving chat message:', error);
        throw error;
    }
};


export const getCurrentChatHistory = (callback) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        const conversationId = getCurrentConversationId();

        const q = query(
            collection(firestore, 'chatMessages'),
            where('userId', '==', user.uid),
            where('conversationId', '==', conversationId),
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


export const getAllConversations = (callback) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        const q = query(
            collection(firestore, 'chatMessages'),
            where('userId', '==', user.uid),
            orderBy('timestamp', 'desc')
        );

        return onSnapshot(q, (snapshot) => {
            const conversationMap = {};
            
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                const convId = data.conversationId;
                
                if (!conversationMap[convId]) {
                    conversationMap[convId] = {
                        id: convId,
                        lastMessage: data.message,
                        timestamp: data.timestamp,
                        messageCount: 1
                    };
                } else {
                    conversationMap[convId].messageCount += 1;
                    if (data.timestamp && (!conversationMap[convId].timestamp || 
                        data.timestamp.seconds > conversationMap[convId].timestamp.seconds)) {
                        conversationMap[convId].lastMessage = data.message;
                        conversationMap[convId].timestamp = data.timestamp;
                    }
                }
            });

            callback(Object.values(conversationMap));
        });
    } catch (error) {
        console.error('Error getting all conversations:', error);
        throw error;
    }
};


export const loadConversation = (conversationId, callback) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        currentConversationId = conversationId;

        const q = query(
            collection(firestore, 'chatMessages'),
            where('userId', '==', user.uid),
            where('conversationId', '==', conversationId),
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