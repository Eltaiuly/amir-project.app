import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
 
const PURPLE = '#9B27D6';
 
function Header({ title, subtitle, onBack }) {
  return (
    <View style={{ marginBottom: 24 }}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={{ marginBottom: 30 }}>
          <Ionicons name="arrow-back" size={26} color="black" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}
 
function Field({ icon, placeholder, value, onChangeText, isPassword, keyboardType }) {
  const [hidden, setHidden] = useState(true);
 
  return (
    <View style={styles.field}>
      <Ionicons name={icon} size={20} color="#999" style={{ marginRight: 10 }} />
      <TextInput
        style={{ flex: 1, fontSize: 15 }}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isPassword && hidden}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
      {isPassword && (
        <TouchableOpacity onPress={() => setHidden(!hidden)}>
          <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={20} color="#999" />
        </TouchableOpacity>
      )}
    </View>
  );
}
 
function Button({ text, onPress, icon }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      {icon && <Ionicons name={icon} size={20} color="white" style={{ marginRight: 8 }} />}
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
}
 
function LoginScreen({ go, user }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
 
  const onLogin = () => {
    if (phone === '' || password === '') {
      Alert.alert('Ошибка', 'Заполните все поля!');
      return;
    }
    if (user.phone === '') {
      Alert.alert('Ошибка', 'Сначала зарегистрируйтесь');
      return;
    }
    if (phone !== user.phone || password !== user.password) {
      Alert.alert('Ошибка', 'Неверный номер или пароль');
      return;
    }
    go('home');
  };
 
  return (
    <View>
      <Header title="Привет, с возвращением!" subtitle="Войдите в свой аккаунт" />
      <Field icon="call-outline" placeholder="Номер телефона" value={phone}
        onChangeText={setPhone} keyboardType="phone-pad" />
      <Field icon="lock-closed-outline" placeholder="Пароль" value={password}
        onChangeText={setPassword} isPassword />
 
      <TouchableOpacity onPress={() => go('forgot')} style={{ alignSelf: 'flex-end', marginBottom: 20 }}>
        <Text style={{ color: PURPLE, fontSize: 13 }}>Забыл пароль?</Text>
      </TouchableOpacity>
 
      <Button text="Войти" onPress={onLogin} />
 
      <Text style={styles.bottomText}>У вас нет аккаунта?</Text>
      <TouchableOpacity onPress={() => go('register')}>
        <Text style={styles.link}>Зарегистрироваться</Text>
      </TouchableOpacity>
    </View>
  );
}
 
function ForgotScreen({ go, user, setCodeFor }) {
  const [phone, setPhone] = useState('');
 
  const onContinue = () => {
    if (phone === '') {
      Alert.alert('Ошибка', 'Введите номер телефона');
    } else if (phone !== user.phone) {
      Alert.alert('Ошибка', 'Такой номер не зарегистрирован');
    } else {
      setCodeFor('reset');
      go('code');
    }
  };
 
  return (
    <View>
      <Header title="Восстановление пароля"
        subtitle="Введите свой номер телефона, чтобы восстановить пароль"
        onBack={() => go('login')} />
      <Field icon="call" placeholder="+7 (700) 555 77 55" value={phone}
        onChangeText={setPhone} keyboardType="phone-pad" />
      <Button text="Продолжить" onPress={onContinue} />
    </View>
  );
}
 
function CodeScreen({ go, user, codeFor }) {
  const [code, setCode] = useState('');
 
  const boxes = [0, 1, 2, 3].map((i) => (
    <View key={i} style={styles.codeBox}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{code[i] || ''}</Text>
    </View>
  ));
 
  const onContinue = () => {
    if (code.length < 4) {
      Alert.alert('Ошибка', 'Введите 4 цифры');
    } else if (codeFor === 'register') {
      go('city');
    } else {
      go('newPassword');
    }
  };
 
  return (
    <View>
      <Header title="Подтвердить номер"
        subtitle={'Мы только что отправили код на ' + user.phone}
        onBack={() => go(codeFor === 'register' ? 'register' : 'forgot')} />
 
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        {boxes}
      </View>
 
      <TextInput
        style={styles.field}
        placeholder="Введите код"
        keyboardType="number-pad"
        maxLength={4}
        value={code}
        onChangeText={setCode}
      />
 
      <Button text="Продолжить" onPress={onContinue} />
      <TouchableOpacity onPress={() => Alert.alert('Готово', 'Код отправлен ещё раз')}>
        <Text style={[styles.bottomText, { textDecorationLine: 'underline' }]}>
          Отправить код еще раз
        </Text>
      </TouchableOpacity>
    </View>
  );
}
 
function NewPasswordScreen({ go, user, setUser }) {
  const [pass1, setPass1] = useState('');
  const [pass2, setPass2] = useState('');
 
  const onSave = () => {
    if (pass1.length < 8) {
      Alert.alert('Ошибка', 'Пароль должен быть не менее 8 символов');
    } else if (pass1 !== pass2) {
      Alert.alert('Ошибка', 'Пароли не совпадают');
    } else {
      setUser({ ...user, password: pass1 });
      Alert.alert('Успех', 'Пароль изменён!');
      go('login');
    }
  };
 
  return (
    <View>
      <Header title="Сбросить пароль"
        subtitle="Не менее 8 символов, с прописными и строчными буквами"
        onBack={() => go('code')} />
      <Field icon="lock-closed-outline" placeholder="Пароль" value={pass1}
        onChangeText={setPass1} isPassword />
      <Field icon="lock-closed-outline" placeholder="Повторить пароль" value={pass2}
        onChangeText={setPass2} isPassword />
      <Button text="Продолжить" onPress={onSave} />
    </View>
  );
}
 
function RegisterScreen({ go, setUser, setCodeFor }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
 
  const onRegister = () => {
    if (name === '' || phone === '' || password === '') {
      Alert.alert('Ошибка', 'Заполните все поля!');
    } else if (password.length < 8) {
      Alert.alert('Ошибка', 'Пароль должен быть не менее 8 символов');
    } else if (!agree) {
      Alert.alert('Ошибка', 'Нужно согласиться с условиями');
    } else {
      setUser({ name: name, phone: phone, password: password, city: '' });
      setCodeFor('register');
      go('code');
    }
  };
 
  return (
    <View>
      <Header title="Регистрация" subtitle="Создайте учетную запись, чтобы продолжить!"
        onBack={() => go('login')} />
      <Field icon="person-outline" placeholder="Ваше имя" value={name} onChangeText={setName} />
      <Field icon="call-outline" placeholder="Номер телефона" value={phone}
        onChangeText={setPhone} keyboardType="phone-pad" />
      <Field icon="lock-closed-outline" placeholder="Пароль" value={password}
        onChangeText={setPassword} isPassword />
 
      <TouchableOpacity style={{ flexDirection: 'row', marginBottom: 20 }} onPress={() => setAgree(!agree)}>
        <Ionicons name={agree ? 'checkbox' : 'square-outline'} size={22} color={PURPLE} />
        <Text style={{ marginLeft: 8, flex: 1, fontSize: 12 }}>
          Создавая учетную запись, вы соглашаетесь с нашими{' '}
          <Text style={{ color: PURPLE }}>Условиями</Text> использования.
        </Text>
      </TouchableOpacity>
 
      <Button text="Зарегистрироваться" onPress={onRegister} />
 
      <Text style={styles.bottomText}>
        Уже есть аккаунт?{' '}
        <Text style={{ color: PURPLE }} onPress={() => go('login')}>Войти</Text>
      </Text>
    </View>
  );
}
 
function CityScreen({ go, user, setUser }) {
  const cities = ['Алматы', 'Астана', 'Шымкент', 'Караганда'];
  const [open, setOpen] = useState(false);
  const [city, setCity] = useState(user.city);
 
  const onContinue = () => {
    if (city === '') {
      Alert.alert('Выберите город');
      return;
    }
    setUser({ ...user, city: city });
    go('home');
  };
 
  return (
    <View>
      <Header title="Выберите город"
        subtitle="Заведения которые будут показываться вам, будут зависеть от вашего города."
        onBack={() => go(user.city === '' ? 'register' : 'home')} />
 
      <TouchableOpacity style={styles.field} onPress={() => setOpen(!open)}>
        <Ionicons name="location-outline" size={20} color="#999" style={{ marginRight: 10 }} />
        <Text style={{ flex: 1, color: city ? 'black' : '#aaa' }}>{city || 'Выбрать город'}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={20} color={PURPLE} />
      </TouchableOpacity>
 
      {open && cities.map((c) => (
        <TouchableOpacity key={c} style={styles.cityItem}
          onPress={() => { setCity(c); setOpen(false); }}>
          <Text>{c}</Text>
        </TouchableOpacity>
      ))}
 
      <View style={{ height: 30 }} />
      <Button text="Продолжить" onPress={onContinue} />
    </View>
  );
}
 
function HomeScreen({ go, user }) {
  const menu = [
    { icon: 'person-circle-outline', text: 'Мой профиль', to: 'profile' },
    { icon: 'headset-outline', text: 'Служба поддержки', to: 'support' },
    { icon: 'help-circle-outline', text: 'Частые вопросы', to: 'faq' },
    { icon: 'location-outline', text: 'Сменить город', to: 'city' },
  ];
 
  return (
    <View>
      <Header title={'Привет, ' + user.name + '!'} subtitle="Добро пожаловать в приложение! 👋" />
      {menu.map((item) => (
        <TouchableOpacity key={item.to} style={styles.menuItem} onPress={() => go(item.to)}>
          <Ionicons name={item.icon} size={26} color={PURPLE} />
          <Text style={{ flex: 1, marginLeft: 12, fontSize: 16 }}>{item.text}</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      ))}
      <View style={{ height: 20 }} />
      <Button text="Выйти" icon="log-out-outline" onPress={() => go('login')} />
    </View>
  );
}
 
function SupportScreen({ go, user }) {
  const [message, setMessage] = useState('');
 
  const onSend = () => {
    if (message === '') {
      Alert.alert('Ошибка', 'Напишите сообщение');
      return;
    }
    Alert.alert('Отправлено', user.name + ', мы ответим вам в течение 24 часов');
    setMessage('');
  };
 
  return (
    <View>
      <Header title="Служба поддержки" subtitle="Мы всегда готовы помочь вам"
        onBack={() => go('home')} />
 
      <View style={styles.menuItem}>
        <Ionicons name="call-outline" size={24} color={PURPLE} />
        <Text style={{ marginLeft: 12 }}>+7 (700) 123 45 67</Text>
      </View>
      <View style={styles.menuItem}>
        <Ionicons name="mail-outline" size={24} color={PURPLE} />
        <Text style={{ marginLeft: 12 }}>support@example.com</Text>
      </View>
      <View style={styles.menuItem}>
        <Ionicons name="logo-whatsapp" size={24} color={PURPLE} />
        <Text style={{ marginLeft: 12 }}>WhatsApp: +7 (700) 123 45 67</Text>
      </View>
 
      <TextInput
        style={[styles.field, { height: 110, textAlignVertical: 'top', marginTop: 10 }]}
        placeholder="Опишите вашу проблему..."
        placeholderTextColor="#aaa"
        multiline
        value={message}
        onChangeText={setMessage}
      />
      <Button text="Отправить" icon="send-outline" onPress={onSend} />
    </View>
  );
}
 
function FaqScreen({ go }) {
  const questions = [
    { q: 'Как изменить пароль?', a: 'Нажмите «Забыл пароль» на экране входа и следуйте инструкции.' },
    { q: 'Как сменить город?', a: 'На главной странице выберите «Сменить город».' },
    { q: 'Не приходит код из СМС', a: 'Подождите минуту и нажмите «Отправить код еще раз».' },
    { q: 'Как удалить аккаунт?', a: 'Напишите нам в службу поддержки.' },
  ];
  const [openIndex, setOpenIndex] = useState(-1);
 
  return (
    <View>
      <Header title="Частые вопросы" subtitle="Ответы на популярные вопросы"
        onBack={() => go('home')} />
      {questions.map((item, index) => (
        <TouchableOpacity key={index} style={styles.faqItem}
          onPress={() => setOpenIndex(openIndex === index ? -1 : index)}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ flex: 1, fontWeight: 'bold' }}>{item.q}</Text>
            <Ionicons name={openIndex === index ? 'chevron-up' : 'chevron-down'} size={20} color={PURPLE} />
          </View>
          {openIndex === index && <Text style={{ marginTop: 8, color: '#555' }}>{item.a}</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
}
 
function ProfileScreen({ go, user }) {
  const [notif, setNotif] = useState(true);
 
  return (
    <View>
      <Header title="Мой профиль" onBack={() => go('home')} />
 
      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        <Ionicons name="person-circle" size={100} color={PURPLE} />
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{user.name}</Text>
        <Text style={{ color: '#999' }}>{user.phone}</Text>
        {user.city !== '' && <Text style={{ color: '#999', marginTop: 4 }}>г. {user.city}</Text>}
      </View>
 
      <TouchableOpacity style={styles.menuItem} onPress={() => setNotif(!notif)}>
        <Ionicons name={notif ? 'notifications' : 'notifications-off-outline'} size={24} color={PURPLE} />
        <Text style={{ flex: 1, marginLeft: 12 }}>Уведомления: {notif ? 'вкл' : 'выкл'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => go('city')}>
        <Ionicons name="location-outline" size={24} color={PURPLE} />
        <Text style={{ flex: 1, marginLeft: 12 }}>Город</Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => go('support')}>
        <Ionicons name="headset-outline" size={24} color={PURPLE} />
        <Text style={{ flex: 1, marginLeft: 12 }}>Поддержка</Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>
    </View>
  );
}
 
function TabBar({ screen, go }) {
  const tabs = [
    { to: 'home', text: 'Главная', icon: 'home-outline', iconActive: 'home' },
    { to: 'support', text: 'Поддержка', icon: 'headset-outline', iconActive: 'headset' },
    { to: 'faq', text: 'Вопросы', icon: 'help-circle-outline', iconActive: 'help-circle' },
    { to: 'profile', text: 'Профиль', icon: 'person-outline', iconActive: 'person' },
  ];
 
  return (
    <View style={styles.tabBar}>
      {tabs.map((t) => {
        const active = screen === t.to;
        return (
          <TouchableOpacity key={t.to} style={styles.tabItem} onPress={() => go(t.to)}>
            <Ionicons name={active ? t.iconActive : t.icon} size={24} color={active ? PURPLE : '#999'} />
            <Text style={{ fontSize: 11, marginTop: 2, color: active ? PURPLE : '#999' }}>{t.text}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
 
export default function App() {
  const [screen, setScreen] = useState('login');
 
  const [user, setUser] = useState({ name: '', phone: '', password: '', city: '' });
 
  const [codeFor, setCodeFor] = useState('register');
 
  const showTabs = ['home', 'support', 'faq', 'profile'].includes(screen);
 
  let content;
  if (screen === 'login') content = <LoginScreen go={setScreen} user={user} />;
  else if (screen === 'forgot') content = <ForgotScreen go={setScreen} user={user} setCodeFor={setCodeFor} />;
  else if (screen === 'code') content = <CodeScreen go={setScreen} user={user} codeFor={codeFor} />;
  else if (screen === 'newPassword') content = <NewPasswordScreen go={setScreen} user={user} setUser={setUser} />;
  else if (screen === 'register') content = <RegisterScreen go={setScreen} setUser={setUser} setCodeFor={setCodeFor} />;
  else if (screen === 'city') content = <CityScreen go={setScreen} user={user} setUser={setUser} />;
  else if (screen === 'home') content = <HomeScreen go={setScreen} user={user} />;
  else if (screen === 'support') content = <SupportScreen go={setScreen} user={user} />;
  else if (screen === 'faq') content = <FaqScreen go={setScreen} />;
  else if (screen === 'profile') content = <ProfileScreen go={setScreen} user={user} />;
 
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 50 }} keyboardShouldPersistTaps="handled">
        {content}
      </ScrollView>
      {showTabs && <TabBar screen={screen} go={setScreen} />}
    </SafeAreaView>
  );
}
 
const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: 'bold' },
  subtitle: { fontSize: 13, color: '#999', marginTop: 6 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 14,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: PURPLE,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 15 },
  bottomText: { textAlign: 'center', color: '#999', marginTop: 16, fontSize: 13 },
  link: { textAlign: 'center', color: PURPLE, fontSize: 13, marginTop: 2 },
  codeBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F6F6F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityItem: { padding: 14, backgroundColor: '#F6F6F6', borderBottomWidth: 1, borderBottomColor: '#eee' },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  faqItem: { backgroundColor: '#F6F6F6', borderRadius: 10, padding: 16, marginBottom: 12 },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: 'white',
    paddingVertical: 8,
  },
  tabItem: { flex: 1, alignItems: 'center' },
});