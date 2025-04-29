import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Print from 'expo-print';
import { Ionicons } from '@expo/vector-icons';

// Первый текст материала
const materialContent1 = `
17.

Сказано в Агаде: «И даже если все мы умные и понят-ливые, все знаем Тору, все равно мы должны рассказывать об ис-ходе из Египта». Подтверждается это утверждение следующим примером: «Как-то рабби Элиэзер и рабби Йеѓошуа сидели вместе и рассказывали о выходе из Египта всю ту ночь».

Как известно[1], в изучении Торы фактически присутствуют две заповеди: одна подразумевает сам учебный процесс, а вторая — знание Торы. В данных словах Агады мы видим, что автор подчеркивает: обязанность рассказывать друг другу об Исходе лежит даже на тех, кто знает Тору. То есть он уже выполнил именно эту заповедь и познал всю Тору целиком.

В своём своде законов, посвящённых изучению Торы («Гилхот Талмуд Тора») Алтер Ребе пишет: «Нет предела глубине смысла законов и палитре мнений мудрецов («пильпуль») об их смысле, истолкованных посредством правил, определённых для этого Торой»[2]. Однако (там же): «Законы, открытые нам и нашим детям, имеют свой предел и конечное число».

Отсюда следует, что заповедь изучения и знания всей Торы в принципе выполнима...
`;

// Сноски для первого материала
const footnotes1 = {
  "1": "См. также маамар «Ве-кабель ѓа-йеѓудим» того года, п. 7 (Торат Менахем, т.2, с.292. Торат Менахем Сефер ѓа-маамарим адар, с.60).",
  "2": "Гл. 1, закон 5; гл. 2, закон 10.",
};

// Второй текст материала
const materialContent2 = `
9.

Как было сказано выше, при таком раскрытии в Песах самой сущности Бесконечного Творца нет необходимости считаться с недостатками в себе на телесном уровне. Про исход из Египта так и сказано, что народ просто бежал оттуда (несмотря на то что со стороны властей никаких преград для желающих покинуть страну уже не было). Причина, как уже говорилось (п. 4), была в том, что внутреннее зло в евреях все еще обладало всей своей изначальной мощью и силой.

Тем не менее нужно понимать, что высшая цель заключается в том, чтобы духовная работа человека была направлена в итоге именно на исправление и возвышение в себе телесного. Он должен поднять в святость также и физическое. Во всей полноте это осуществится в будущем, когда исполнится обещанное: «И сметет Всевышний дух скверны с земли»[1].

Вот тогда Освобождение уже не придет в том виде, как оно явилось к евреям в Египте, когда «бежал народ». Но все уже будет исправлено, вплоть до самой грубой телесности. Поэтому о грядущем освобождении сказано: «И не в спешке будете уходить, и не бегством будете спасаться»[2] (смотри объяснение этого в упомянутой выше главе Тании[3]).

Можно предположить, что нечто подобное происходит в Песах, канун которого выпадает на Шабат. В такой ситуации, как мы говорили, принцип, чтобы пасхальная жертва была съедена именно на сытый желудок, не играет никакой роли. Вкушать ее можно как угодно, даже если человек голоден и поедает ее с животным аппетитом.

Объясним.

Трапеза в Шабат отличается от того, как принимают пищу в будние дни. В Шабат возвышены даже обычный человеческий голод и стремление утолить его. Ведь они не только вызваны физической потребностью и желанием плотского наслаждения человека, но и связаны с особой заповедью[4].
`;

// Сноски для второго материала
const footnotes2 = {
  "1": "Согласно сказанному в Зхарья, 13:2.",
  "2": "Йешаяѓу, 52:12.",
  "3": "Гл. 31.",
  "4": "См. Тур и Шулхан Арух, а также Шулхан Арух Алтер Ребе, раздел «Орах хаим», гл. 242, в начале.",
};

export default function ReaderScreen() {
  const route = useRoute<any>();
  const { id } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState('');

  const selectedMaterial = id === 1 ? materialContent1 : materialContent2;
  const selectedFootnotes: { [key: string]: string } = id === 1 ? footnotes1 : footnotes2;
 
  const handleOpenFootnote = (key: string) => {
    if (selectedFootnotes[key]) {
      setModalText(selectedFootnotes[key]);
      setModalVisible(true);
    }
  };

  const handlePrint = async () => {
    await Print.printAsync({
      html: `<html><body><pre style='font-size:16px;'>${selectedMaterial}</pre></body></html>`,
    });
  };

  const renderTextWithFootnotes = (text: string) => {
    const paragraphs = text.split(/\n+/);

    return paragraphs.map((paragraph, index) => {
      const regex = /\[(\d+)\]/g;
      const parts: any[] = [];
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(paragraph)) !== null) {
        const matchStart = match.index;
        const matchEnd = regex.lastIndex;
        const number = match[1];

        if (lastIndex < matchStart) {
          parts.push(paragraph.slice(lastIndex, matchStart));
        }

        parts.push(
          <Text
            key={`link-${index}-${number}-${Math.random()}`}
            style={styles.link}
            onPress={() => handleOpenFootnote(number)}
          >
            [{number}]
          </Text>
        );

        lastIndex = matchEnd;
      }

      if (lastIndex < paragraph.length) {
        parts.push(paragraph.slice(lastIndex));
      }

      return (
        <Text key={`paragraph-${index}-${Date.now()}`} style={styles.text}>
          {parts}
          {'\n\n'}
        </Text>
      );
    });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Материал {id}</Text>
        <Pressable onPress={handlePrint} style={styles.printButton}>
          <Ionicons name="print" size={24} color="#007BFF" />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {renderTextWithFootnotes(selectedMaterial)}
      </ScrollView>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Примечание</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              <Text style={styles.modalTextCenter}>{modalText}</Text>
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    lineHeight: 28,
    color: '#333',
  },
  link: {
    fontSize: 18,
    color: '#007BFF',
  },
  printButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 20,
    width: '85%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalTextCenter: {
    fontSize: 18,
    textAlign: 'center',
  },
});
