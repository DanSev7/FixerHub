import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Search, MessageSquare, Send } from 'lucide-react-native';
 

export default function ClientMessages() {
  const { user } = useAuth();
 const [conversations, setConversations] = useState([]);
const [selectedConversation, setSelectedConversation] = useState(null);
const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    if (!user) return;

    try {
      // Get all conversations for the current user
      const { data, error } = await supabase
        .from('messages')
        .select(`
          sender_id,
          receiver_id,
          message_text,
          timestamp,
          is_read,
          sender:users!messages_sender_id_fkey(username),
          receiver:users!messages_receiver_id_fkey(username)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      // Group messages by conversation partner
      const conversationMap = new Map();


      data?.forEach((message: any) => {
        const partnerId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
        const partnerName = message.sender_id === user.id 
          ? message.receiver.username 
          : message.sender.username;

        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, {
            user_id: partnerId,
            username: partnerName,
            last_message: message.message_text,
            last_message_time: message.timestamp,
            unread_count: message.receiver_id === user.id && !message.is_read ? 1 : 0,
          });
        } else {
          const conversation = conversationMap.get(partnerId);
          if (message.receiver_id === user.id && !message.is_read) {
            conversation.unread_count++;
          }
        }
      });

      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadMessages = async (partnerId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey(username)
        `)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user.id})`)
        .order('timestamp', { ascending: true });

      if (error) throw error;

      const formattedMessages = data?.map((message: any) => ({
        ...message,
        sender_name: message.sender.username,
      })) || [];

      setMessages(formattedMessages);

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('sender_id', partnerId)
        .eq('receiver_id', user.id);

    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!user || !selectedConversation || !newMessage.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: selectedConversation,
          message_text: newMessage.trim(),
        });

      if (error) throw error;

      setNewMessage('');
      loadMessages(selectedConversation);
      loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={[
        styles.conversationItem,
        selectedConversation === item.user_id && styles.conversationItemSelected,
      ]}
      onPress={() => {
        setSelectedConversation(item.user_id);
        loadMessages(item.user_id);
      }}
    >
      <View style={styles.conversationInfo}>
        <Text style={styles.conversationName}>{item.username}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.last_message}
        </Text>
      </View>
      <View style={styles.conversationMeta}>
        <Text style={styles.messageTime}>
          {new Date(item.last_message_time).toLocaleDateString()}
        </Text>
        {item.unread_count > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unread_count}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isMyMessage = item.sender_id === user?.id;
    
    return (
      <View style={[
        styles.messageContainer,
        isMyMessage ? styles.myMessage : styles.otherMessage,
      ]}>
        <Text style={[
          styles.messageText,
          isMyMessage ? styles.myMessageText : styles.otherMessageText,
        ]}>
          {item.message_text}
        </Text>
        <Text style={[
          styles.messageTime,
          isMyMessage ? styles.myMessageTime : styles.otherMessageTime,
        ]}>
          {new Date(item.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
    );
  };

  if (selectedConversation) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.messageHeader}>
          <TouchableOpacity
            onPress={() => setSelectedConversation(null)}
            style={styles.backButton}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.messageTitle}>
            {conversations.find(c => c.user_id === selectedConversation)?.username}
          </Text>
        </View>

        <FlatList
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.message_id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
        />

        <View style={styles.messageInput}>
          <TextInput
            style={styles.textInput}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!newMessage.trim()}
          >
            <Send size={20} color={newMessage.trim() ? '#2563EB' : '#9CA3AF'} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {conversations.length > 0 ? (
        <FlatList
          data={conversations.filter(c => 
            c.username.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          renderItem={renderConversationItem}
          keyExtractor={(item) => item.user_id}
          style={styles.conversationsList}
        />
      ) : (
        <View style={styles.emptyState}>
          <MessageSquare size={48} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No Messages Yet</Text>
          <Text style={styles.emptyDescription}>
            Start a conversation with a professional to see messages here
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 14,
    color: '#111827',
  },
  conversationsList: {
    flex: 1,
  },
  conversationItem: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conversationItemSelected: {
    backgroundColor: '#EBF8FF',
  },
  conversationInfo: {
    flex: 1,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#6B7280',
  },
  conversationMeta: {
    alignItems: 'flex-end',
  },
  messageTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  unreadBadge: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  messageHeader: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  backText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '500',
  },
  messageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  messagesList: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#2563EB',
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: '#111827',
  },
  myMessageTime: {
    color: 'rgba(255,255,255,0.8)',
  },
  otherMessageTime: {
    color: '#9CA3AF',
  },
  messageInput: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
    color: '#111827',
  },
  sendButton: {
    marginLeft: 12,
    padding: 10,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});