import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../services/supabase';
import { ConversationList } from '../components/inbox/ConversationList';
import { ChatWindow } from '../components/inbox/ChatWindow';

export const InboxPage = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sendLoading, setSendLoading] = useState(false);

    // 📩 FETCH CONVERSATION LEDGER
    const fetchConversations = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('conversations')
                .select(`
                    id, 
                    created_at,
                    participants:conversation_participants(
                        user_id,
                        profile:profiles(id, full_name, avatar_url, department)
                    ),
                    messages(content, created_at, sender_id)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Sort messages within conversations manually if needed, or refine query
            const formatted = (data || []).map(conv => ({
                ...conv,
                messages: conv.messages.sort((a,b) => new Date(b.created_at) - new Date(a.created_at)),
                unread_count: 0 // Logic to be implemented
            }));

            setConversations(formatted);
        } catch (err) {
            console.error("Sync Failure:", err.message);
        } finally {
            setLoading(false);
        }
    };

    // 🌊 LOAD MESSAGE HUB
    const fetchMessages = async (convId) => {
        if (!convId) return;
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', convId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            setMessages(data || []);
        } catch (err) {
            console.error("Transmission Interruption:", err.message);
        }
    };

    // 🛰️ TRANSMIT PULSE
    const handleSendMessage = async (content) => {
        if (!activeConversation || !user) return;
        setSendLoading(true);
        try {
            const { error } = await supabase
                .from('messages')
                .insert([{
                    conversation_id: activeConversation.id,
                    sender_id: user.id,
                    content
                }]);

            if (error) throw error;
            
            // UI already updates via realtime sync
        } catch (err) {
            console.error("Message Sync Failed:", err.message);
        } finally {
            setSendLoading(false);
        }
    };

    // 🔄 INITIALIZE HUB
    useEffect(() => {
        fetchConversations();
    }, [user]);

    // ⚡ REAL-TIME SYCHRONIZATION
    useEffect(() => {
        if (!user) return;

        const channel = supabase
            .channel('realtime-messages')
            .on('postgres_changes', { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'messages' 
            }, (payload) => {
                const newMessage = payload.new;
                
                // 1. Update active chat
                if (activeConversation?.id === newMessage.conversation_id) {
                    setMessages(prev => [...prev, newMessage]);
                }

                // 2. Update conversation list preview
                setConversations(prev => prev.map(conv => 
                    conv.id === newMessage.conversation_id 
                    ? { ...conv, messages: [newMessage, ...conv.messages] } 
                    : conv
                ));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [activeConversation, user]);

    // 📱 HANDLERS
    const selectConversation = (conv) => {
        setActiveConversation(conv);
        fetchMessages(conv.id);
    };

    return (
        <div className="h-full bg-white flex overflow-hidden border border-gray-100 rounded-[48px] shadow-soft min-h-[85vh]">
            
            {/* 📬 INBOUND SIDEPANEL */}
            <ConversationList 
               conversations={conversations}
               activeId={activeConversation?.id}
               onSelect={selectConversation}
               loading={loading}
               userId={user?.id}
            />

            {/* 🛰️ ACTIVE TERMINAL HUB */}
            <ChatWindow 
               conversation={activeConversation}
               messages={messages}
               onSend={handleSendMessage}
               onBack={() => setActiveConversation(null)}
               loading={loading || sendLoading}
               userId={user?.id}
            />

        </div>
    );
};
