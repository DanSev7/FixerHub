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
    const message = userMessage.toLowerCase();

    if (message.includes('plumber') || message.includes('leak') || message.includes('sink')) {
      return `It sounds like you need plumbing services. 🛠️ You can search for a licensed plumber in your city through the platform. Make sure to describe the issue (e.g. "leaking sink in the kitchen") and your location for quicker help.`;
    } else if (message.includes('electric') || message.includes('outlet') || message.includes('socket') || message.includes('wiring')) {
      return `For electrical problems like faulty outlets or wiring, look for a certified electrician in your area. ⚡ Include the issue and city so pros can assist you better.`;
    } else if (message.includes('clean') || message.includes('dust') || message.includes('maid')) {
      return `Need help cleaning? 🧼 You can hire local cleaners for one-time or recurring services. Describe the job (e.g. apartment cleaning, 2 bedrooms) and your city to get matched.`;
    } else if (message.includes('garden') || message.includes('lawn') || message.includes('tree') || message.includes('landscape')) {
      return `For lawn care, tree trimming, or garden makeovers 🌱, search for gardeners or landscapers nearby. Mention the work needed and your city to receive estimates.`;
    } else if (message.includes('carpenter') || message.includes('furniture') || message.includes('wood') || message.includes('cabinet')) {
      return `If you're building or fixing furniture, a skilled carpenter can help. 🪚 Try describing your need (e.g. "assemble a bookshelf" or "custom cabinet install") and your area.`;
    } else if (message.includes('book') || message.includes('schedule')) {
      return `To book a service, first describe what kind of job you need and where you're located. You’ll then be able to view available professionals and choose one based on their profile and rates. 📅`;
    }else if (message.includes('paint') || message.includes('painting') || message.includes('wall')) {
  return `Looking for painting services? 🎨 Whether it's interior or exterior walls, find professional painters nearby. Be sure to specify the area and type of paint job for accurate quotes.`;
} else if (message.includes('roof') || message.includes('leakage') || message.includes('shingles')) {
  return `Roof repairs or replacements? 🏠 Search for experienced roofing contractors in your city. Describe the issue like "roof leak after rain" to get the best help.`;
} else if (message.includes('pest') || message.includes('exterminator') || message.includes('insects') || message.includes('rodents')) {
  return `Dealing with pests? 🐜 Find licensed pest control experts for termite treatment, rodent removal, and more. Mention the pest type and location for quick assistance.`;
} else if (message.includes('hvac') || message.includes('air conditioning') || message.includes('heater') || message.includes('furnace')) {
  return `Need HVAC services? ❄️🔥 Look for certified technicians to repair or install air conditioners, heaters, or furnaces. Include your city and the specific problem for faster service.`;
} else if (message.includes('moving') || message.includes('relocate') || message.includes('pack') || message.includes('storage')) {
  return `Planning a move? 🚚 Hire professional movers for packing, transporting, or storage solutions. Describe the size of your move and location to find the right team.`;
} else if (message.includes('cleanse') || message.includes('detox') || message.includes('spa')) {
  return `Looking for wellness services? 💆‍♀️ Search for local spas, massage therapists, or detox centers. Specify the treatment and your area to get personalized recommendations.`;
} else if (message.includes('tutor') || message.includes('lesson') || message.includes('class') || message.includes('teacher')) {
  return `Need tutoring or lessons? 📚 Find qualified tutors or instructors for various subjects or skills. Mention the subject and your location to connect with the best fit.`;
} else if (message.includes('car') || message.includes('auto') || message.includes('mechanic') || message.includes('repair')) {
  return `Car troubles? 🚗 Search for trusted mechanics or auto repair shops nearby. Describe the issue and your city to get reliable service options.`;
} else if (message.includes('tech') || message.includes('computer') || message.includes('repair') || message.includes('setup')) {
  return `Having tech issues? 💻 Find IT professionals or computer repair services in your area. Include the device and problem for tailored support.`;
}
else if (message.includes('lock') || message.includes('key') || message.includes('locksmith')) {
  return `Locked out or need new keys? 🔐 Find reliable locksmiths nearby for lock repairs, key duplication, or emergency lockout services. Provide your location for quick assistance.`;
} else if (message.includes('window') || message.includes('glass') || message.includes('pane') || message.includes('repair')) {
  return `Need window or glass repairs? 🪟 Search for professionals who can fix or replace broken windows, glass panes, or screens. Mention the type of repair and your city for accurate quotes.`;
} else if (message.includes('floor') || message.includes('tile') || message.includes('carpet') || message.includes('hardwood')) {
  return `Looking to install or repair flooring? 🛠️ Find experts in tile, carpet, hardwood, or laminate flooring. Describe your project and location to get matched with pros.`;
} else if (message.includes('appliance') || message.includes('fridge') || message.includes('oven') || message.includes('washer') || message.includes('dryer')) {
  return `Appliance not working? 🧺 Find certified technicians to repair refrigerators, ovens, washers, dryers, and more. Include the appliance type and your area for faster help.`;
} else if (message.includes('roof cleaning') || message.includes('gutter') || message.includes('pressure wash') || message.includes('power wash')) {
  return `Need exterior cleaning? 🚿 Look for services like roof cleaning, gutter clearing, or pressure washing. Specify the service and your location to find local providers.`;
} else if (message.includes('photographer') || message.includes('photo') || message.includes('shoot') || message.includes('wedding')) {
  return `Looking for a photographer? 📸 Find professionals for events, portraits, weddings, or commercial shoots. Mention the event type and city to connect with photographers near you.`;
} else if (message.includes('cater') || message.includes('catering') || message.includes('food') || message.includes('party')) {
  return `Planning an event? 🍽️ Search for catering services to provide delicious food for your party or gathering. Include your location and event details for the best matches.`;
} else if (message.includes('fitness') || message.includes('trainer') || message.includes('yoga') || message.includes('personal trainer')) {
  return `Want to get fit? 💪 Find personal trainers, yoga instructors, or fitness coaches nearby. Describe your goals and location to find the perfect match.`;
} else if (message.includes('pet') || message.includes('dog walker') || message.includes('pet sitter') || message.includes('grooming')) {
  return `Need pet care? 🐕 Find dog walkers, pet sitters, or groomers in your area. Specify the service and your city to get connected with trusted pet professionals.`;
} else if (message.includes('translator') || message.includes('translation') || message.includes('interpreter') || message.includes('language')) {
  return `Looking for translation or interpretation services? 🌐 Find qualified translators or interpreters for various languages. Mention the language and location to get started.`;
} else if (message.includes('event planner') || message.includes('party') || message.includes('wedding planner') || message.includes('organizer')) {
  return `Planning an event? 🎉 Hire experienced event planners or organizers to make your occasion memorable. Provide details and your city to find the right professionals.`;
} else if (message.includes('legal') || message.includes('lawyer') || message.includes('attorney') || message.includes('consultation')) {
  return `Need legal advice? ⚖️ Search for qualified lawyers or legal consultants in your area. Describe your issue and location to connect with legal experts.`;
} else if (message.includes('accountant') || message.includes('tax') || message.includes('bookkeeping') || message.includes('finance')) {
  return `Looking for financial help? 💼 Find accountants, tax preparers, or bookkeepers nearby. Mention your needs and city for personalized assistance.`;
} else if (message.includes('massage') || message.includes('therapist') || message.includes('spa') || message.includes('relax')) {
  return `Want to relax? 💆‍♂️ Find massage therapists or spa services in your area. Specify the treatment type and location to get matched.`;
} else if (message.includes('web') || message.includes('design') || message.includes('developer') || message.includes('website')) {
  return `Need a website or app? 💻 Find skilled web designers and developers nearby. Describe your project and location to get started.`;
}


    return `I didn’t find a match for your request. 🤔 Try describing what kind of service you need (like "cleaning", "gardening", or "electrical work") and include your location so I can guide you better.`;
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
        { id: Math.random().toString(), text: 'Failed to get response.', sender: 'ai' },
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
