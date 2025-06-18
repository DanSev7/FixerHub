import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send } from 'lucide-react-native';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const getAIResponse = async (userMessage: string): Promise<string> => {
    const message = userMessage.toLowerCase().trim();

    // Greetings and General Inquiries
    if (message === 'hello' || message === 'hi' || message === 'hey') {
      return `Selam! 👋 Welcome to FixerHub in Addis Ababa. How can I help you find a professional today? Need a plumber, electrician, or maybe a cleaner? Just let me know!`;
    } else if (message.includes('how are you') || message.includes('how’s it going')) {
      return `I’m doing great, thanks for asking! 😊 Ready to connect you with top professionals in Addis Ababa. What service are you looking for today?`;
    } else if (message.includes('what can you do') || message.includes('help')) {
      return `I’m here to help you find skilled professionals in Addis Ababa! 🛠️ Whether it’s plumbing, electrical work, cleaning, or even tailoring, just tell me what you need, and I’ll guide you to the right pros. What’s on your mind?`;
    } else if (message.includes('who are you') || message.includes('about')) {
      return `I’m FixerHub’s AI assistant, here to make finding professionals in Addis Ababa easy! 🌆 Tell me what service you need—like carpentry, pest control, or gardening—and I’ll point you in the right direction.`;
    }

    // Service-Specific Responses
    if (message.includes('plumber') || message.includes('leak') || message.includes('sink') || message.includes('pipe')) {
      return `Got a plumbing issue? 🚰 In Addis Ababa, you can find skilled plumbers on FixerHub. Describe the problem (e.g., "leaking pipe under sink") to connect with pros near you.`;
    } else if (message.includes('electric') || message.includes('outlet') || message.includes('socket') || message.includes('wiring')) {
      return `Electrical trouble? ⚡ Search for certified electricians in Addis Ababa on FixerHub. Specify the issue (e.g., "faulty socket in Bole") to find reliable pros.`;
    } else if (message.includes('clean') || message.includes('dust') || message.includes('maid') || message.includes('housekeeping')) {
      return `Need a cleaner in Addis Ababa? 🧼 FixerHub has trusted cleaners for homes or offices. Tell us about the job (e.g., "deep clean 3-bedroom house in Kazanchis") to get matched.`;
    } else if (message.includes('garden') || message.includes('lawn') || message.includes('tree') || message.includes('landscape')) {
      return `Want a beautiful garden? 🌱 Find gardeners or landscapers in Addis Ababa on FixerHub. Describe your needs (e.g., "lawn mowing in Gullele") to connect with experts.`;
    } else if (message.includes('carpenter') || message.includes('furniture') || message.includes('wood') || message.includes('cabinet')) {
      return `Looking for carpentry work? 🪚 Addis Ababa’s carpenters on FixerHub can build or repair furniture. Share details (e.g., "custom wardrobe in Yeka") to find the right pro.`;
    } else if (message.includes('paint') || message.includes('painting') || message.includes('wall')) {
      return `Need painting services? 🎨 Find professional painters in Addis Ababa on FixerHub. Specify the job (e.g., "paint living room in Nifas Silk") for accurate matches.`;
    } else if (message.includes('roof') || message.includes('leakage') || message.includes('shingles')) {
      return `Roof problems? 🏠 Connect with roofing experts in Addis Ababa via FixerHub. Describe the issue (e.g., "roof leak in Arada") to find trusted contractors.`;
    } else if (message.includes('pest') || message.includes('exterminator') || message.includes('insects') || message.includes('rodents')) {
      return `Pest issues? 🐜 FixerHub has pest control experts in Addis Ababa for termites, rodents, and more. Mention the pest type (e.g., "cockroaches in Lideta") to get help.`;
    } else if (message.includes('hvac') || message.includes('air conditioning') || message.includes('heater') || message.includes('furnace')) {
      return `Need HVAC services? ❄️🔥 Find technicians in Addis Ababa on FixerHub for AC or heater repairs. Share the problem (e.g., "AC not cooling in Kirkos") for quick matches.`;
    } else if (message.includes('moving') || message.includes('relocate') || message.includes('pack') || message.includes('storage')) {
      return `Planning a move in Addis Ababa? 🚚 FixerHub connects you with movers for packing or transport. Describe your move (e.g., "2-bedroom move in Bole") to find pros.`;
    } else if (message.includes('tutor') || message.includes('lesson') || message.includes('class') || message.includes('teacher')) {
      return `Need tutoring in Addis Ababa? 📚 Find qualified tutors on FixerHub for subjects like math or English. Specify the subject (e.g., "grade 10 physics in Yeka") to connect.`;
    } else if (message.includes('car') || message.includes('auto') || message.includes('mechanic') || message.includes('repair')) {
      return `Car issues? 🚗 Find trusted mechanics in Addis Ababa on FixerHub. Describe the problem (e.g., "brake repair in Kazanchis") to get reliable pros.`;
    } else if (message.includes('tech') || message.includes('computer') || message.includes('repair') || message.includes('setup')) {
      return `Tech troubles? 💻 FixerHub has IT experts in Addis Ababa for computer repairs or setups. Share the issue (e.g., "laptop screen fix in Arada") to find help.`;
    } else if (message.includes('lock') || message.includes('key') || message.includes('locksmith')) {
      return `Locked out? 🔐 Find locksmiths in Addis Ababa on FixerHub for lock repairs or key duplication. Mention your need (e.g., "house lockout in Gullele") for fast help.`;
    } else if (message.includes('window') || message.includes('glass') || message.includes('pane') || message.includes('repair')) {
      return `Need window repairs? 🪟 Connect with glass repair pros in Addis Ababa via FixerHub. Describe the job (e.g., "broken window in Nifas Silk") to find experts.`;
    } else if (message.includes('floor') || message.includes('tile') || message.includes('carpet') || message.includes('hardwood')) {
      return `Flooring needs? 🛠️ Find tile, carpet, or hardwood experts in Addis Ababa on FixerHub. Share your project (e.g., "tile kitchen floor in Bole") for matches.`;
    } else if (message.includes('appliance') || message.includes('fridge') || message.includes('oven') || message.includes('washer') || message.includes('dryer')) {
      return `Appliance broken? 🧺 Find technicians in Addis Ababa on FixerHub for fridge, oven, or washer repairs. Specify the appliance (e.g., "dryer fix in Lideta") to connect.`;
    } else if (message.includes('roof cleaning') || message.includes('gutter') || message.includes('pressure wash') || message.includes('power wash')) {
      return `Need exterior cleaning? 🚿 Find roof or gutter cleaning pros in Addis Ababa on FixerHub. Describe the job (e.g., "gutter cleaning in Kirkos") for quick matches.`;
    } else if (message.includes('photographer') || message.includes('photo') || message.includes('shoot') || message.includes('wedding')) {
      return `Need a photographer in Addis Ababa? 📸 FixerHub connects you with pros for weddings or events. Share details (e.g., "wedding shoot in Bole") to find talent.`;
    } else if (message.includes('cater') || message.includes('catering') || message.includes('food') || message.includes('party')) {
      return `Hosting an event? 🍽️ Find caterers in Addis Ababa on FixerHub for delicious meals. Describe your event (e.g., "party for 50 in Kazanchis") to get matched.`;
    } else if (message.includes('fitness') || message.includes('trainer') || message.includes('yoga') || message.includes('personal trainer')) {
      return `Want to get fit? 💪 Find trainers or yoga instructors in Addis Ababa on FixerHub. Share your goals (e.g., "yoga classes in Yeka") to connect with pros.`;
    } else if (message.includes('pet') || message.includes('dog walker') || message.includes('pet sitter') || message.includes('grooming')) {
      return `Need pet care? 🐕 Find dog walkers or groomers in Addis Ababa on FixerHub. Specify the service (e.g., "dog grooming in Arada") to find trusted pros.`;
    } else if (message.includes('translator') || message.includes('translation') || message.includes('interpreter') || message.includes('language')) {
      return `Need translation services? 🌐 Find translators in Addis Ababa on FixerHub for Amharic, English, or other languages. Share your need (e.g., "document translation in Bole").`;
    } else if (message.includes('event planner') || message.includes('party') || message.includes('wedding planner') || message.includes('organizer')) {
      return `Planning an event? 🎉 Find event planners in Addis Ababa on FixerHub for weddings or parties. Describe your event (e.g., "wedding in Kirkos") to connect.`;
    } else if (message.includes('legal') || message.includes('lawyer') || message.includes('attorney') || message.includes('consultation')) {
      return `Need legal help? ⚖️ Find lawyers in Addis Ababa on FixerHub for consultations or cases. Share your issue (e.g., "contract review in Lideta") to find experts.`;
    } else if (message.includes('accountant') || message.includes('tax') || message.includes('bookkeeping') || message.includes('finance')) {
      return `Financial needs? 💼 Find accountants in Addis Ababa on FixerHub for taxes or bookkeeping. Describe your need (e.g., "tax filing in Nifas Silk") to get matched.`;
    } else if (message.includes('massage') || message.includes('therapist') || message.includes('spa') || message.includes('relax')) {
      return `Need to relax? 💆‍♂️ Find massage therapists in Addis Ababa on FixerHub. Specify the service (e.g., "deep tissue massage in Bole") to connect with pros.`;
    } else if (message.includes('web') || message.includes('design') || message.includes('developer') || message.includes('website')) {
      return `Need a website? 💻 Find web developers in Addis Ababa on FixerHub. Share your project (e.g., "e-commerce site in Kazanchis") to find experts.`;
    }

    // New Service Categories for Ethiopia
    if (message.includes('mason') || message.includes('brick') || message.includes('construction')) {
      return `Need masonry or construction work? 🧱 Find skilled masons in Addis Ababa on FixerHub. Describe your project (e.g., "brick wall in Gullele") to connect with pros.`;
    } else if (message.includes('tailor') || message.includes('sewing') || message.includes('dress') || message.includes('clothing')) {
      return `Looking for tailoring? ✂️ FixerHub has tailors in Addis Ababa for custom dresses or repairs. Share your need (e.g., "wedding dress in Yeka") to find experts.`;
    } else if (message.includes('security') || message.includes('guard') || message.includes('surveillance')) {
      return `Need security services? 🔒 Find security guards or surveillance experts in Addis Ababa on FixerHub. Specify your need (e.g., "event security in Bole") for matches.`;
    } else if (message.includes('driver') || message.includes('transport') || message.includes('delivery')) {
      return `Need a driver or delivery service? 🚖 Find reliable drivers in Addis Ababa on FixerHub. Describe your need (e.g., "daily commute in Kirkos") to connect.`;
    } else if (message.includes('barber') || message.includes('haircut') || message.includes('salon')) {
      return `Need a haircut? 💇‍♂️ Find barbers or salons in Addis Ababa on FixerHub. Share your need (e.g., "men’s haircut in Arada") to find pros.`;
    } else if (message.includes('courier') || message.includes('package') || message.includes('delivery')) {
      return `Need to send a package? 📦 Find courier services in Addis Ababa on FixerHub. Describe your delivery (e.g., "package to Kazanchis") to get matched.`;
    } else if (message.includes('makeup') || message.includes('beauty') || message.includes('bridal')) {
      return `Need makeup services? 💄 Find makeup artists in Addis Ababa on FixerHub for events or bridal looks. Share details (e.g., "bridal makeup in Bole") to connect.`;
    } else if (message.includes('internet') || message.includes('wifi') || message.includes('network')) {
      return `Internet issues? 📡 Find network technicians in Addis Ababa on FixerHub to fix WiFi or setups. Describe the problem (e.g., "slow WiFi in Lideta") for help.`;
    }

    // Fallback Response
    return `I’m not sure about that request. 🤔 Please describe the service you need (e.g., "plumbing," "cleaning," or "tailoring") and mention your area in Addis Ababa so I can guide you to the right professionals on FixerHub!`;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      text: input.trim(),
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const aiResponseText = await getAIResponse(userMessage.text);

      const aiMessage: Message = {
        id: Math.random().toString(),
        text: aiResponseText,
        sender: 'ai',
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: Math.random().toString(), text: 'Failed to get response. Please try again.', sender: 'ai' },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.aiMessage,
        ]}
      >
        <Text style={isUser ? styles.userText : styles.aiText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>AI Chat</Text>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {loading && <ActivityIndicator size="small" color="#2563EB" style={{ marginBottom: 10 }} />}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Send size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  chatContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  messageContainer: {
    maxWidth: '75%',
    padding: 14,
    marginVertical: 6,
    borderRadius: 16,
  },
  userMessage: {
    backgroundColor: '#2563EB',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  aiMessage: {
    backgroundColor: '#E5E7EB',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  userText: {
    color: 'white',
    fontSize: 16,
  },
  aiText: {
    color: '#111827',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 12,
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});