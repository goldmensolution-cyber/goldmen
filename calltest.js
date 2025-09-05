import fetch from 'node-fetch';

const response = await fetch('https://goldmen.co.ke/api/kyanda/callback', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    transactionId: 'TX123456789',
    amount: 100,
    phoneNumber: '254712345678',
    status: 'SUCCESS',
    reference: 'KYANDA001',
    timestamp: new Date().toISOString()
  })
});

const result = await response.json();
console.log(result);

