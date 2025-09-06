import { useState } from 'react';
import { createNewChat } from '../services/chatService';

export default function SidebarRight() {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Check if file is PDF
        if (file.type !== 'application/pdf') {
            alert('Please upload a PDF file only.');
            return;
        }

        setIsUploading(true);
        
        try {
            const result = await createNewChat(file);
            
            if (result.success) {
                setUploadedFiles(prev => [...prev, {
                    name: file.name,
                    size: file.size,
                    chatId: result.chatId,
                    uploadedAt: new Date()
                }]);
                
                // Trigger new chat event
                window.dispatchEvent(new CustomEvent('newChatCreated'));
                
                alert('File uploaded successfully! You can now start chatting.');
            } else {
                alert('Error uploading file: ' + result.error);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Error uploading file: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="p-4">
            <h2 className="text-lg mb-4 font-semibold text-white">Documents</h2>

            <div className="border-2 border-dashed border-[#4C82FB] p-6 rounded-xl text-center cursor-pointer hover:bg-[#1c1c1c] transition">
                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                    id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                    {isUploading ? (
                        <div className="text-[#4C82FB]">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4C82FB] mx-auto mb-2"></div>
                            Uploading...
                        </div>
                    ) : (
                        <div>
                            Drag & drop or click to upload PDF
                        </div>
                    )}
                </label>
            </div>

            {uploadedFiles.length > 0 && (
                <ul className="mt-4 space-y-2">
                    {uploadedFiles.map((file, index) => (
                        <li key={index} className="p-3 rounded-lg bg-[#1c1c1c] hover:bg-[#2a2a2a] cursor-pointer flex justify-between">
                            <span className="text-sm text-white truncate">{file.name}</span>
                            <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}