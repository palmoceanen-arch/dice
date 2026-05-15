// Простой тест WebSocket соединения
// Запуск: node test-ws.js

import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:3002');

// Фейковые данные Telegram пользователя (для dev режима)
const fakeInitData = 'user=' + encodeURIComponent(JSON.stringify({
  id: 123456789,
  first_name: 'Test',
  last_name: 'User',
  username: 'testuser'
})) + '&hash=fake';

ws.on('open', () => {
  console.log('✓ Connected to WebSocket');
  
  // Отправляем auth
  console.log('→ Sending auth...');
  ws.send(JSON.stringify({
    type: 'auth',
    initData: fakeInitData
  }));
});

ws.on('message', (data) => {
  const msg = JSON.parse(data.toString());
  console.log('← Received:', JSON.stringify(msg, null, 2));
  
  if (msg.type === 'auth_success') {
    console.log('\n✓ Auth successful!');
    console.log('  User ID:', msg.user.id);
    console.log('  Nickname:', msg.user.nickname);
    console.log('  Inventory:', msg.inventory.length, 'items');
    
    // Тест поиска пользователя
    setTimeout(() => {
      console.log('\n→ Searching for @testuser...');
      ws.send(JSON.stringify({
        type: 'search_user',
        username: 'testuser'
      }));
    }, 500);
    
    // Закрыть через 2 сек
    setTimeout(() => {
      console.log('\n✓ Test completed!');
      ws.close();
      process.exit(0);
    }, 2000);
  }
});

ws.on('error', (err) => {
  console.error('✗ WebSocket error:', err.message);
});

ws.on('close', () => {
  console.log('Connection closed');
});
