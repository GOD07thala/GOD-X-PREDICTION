
const auth = firebase.auth();
const db = firebase.firestore();
let timer = 60;
let interval = null;

function loginWithKey() {
  const key = document.getElementById('loginKey').value.trim();
  db.collection('access_keys').doc(key).get().then(doc => {
    if (!doc.exists) return alert('Invalid Key');
    const data = doc.data();
    if (data.used) return alert('Key already used');
    if (new Date() > data.expiry.toDate()) return alert('Key expired');
    db.collection('access_keys').doc(key).update({ used: true });
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('appSection').classList.remove('hidden');
    startPrediction();
  });
}

function startPrediction() {
  interval = setInterval(() => {
    timer--;
    document.getElementById('timer').textContent = timer;
    if (timer <= 0) {
      timer = 60;
      generatePrediction();
    }
  }, 1000);
}

function generatePrediction() {
  const colors = ['RED', 'GREEN', 'VIOLET'];
  const prediction = colors[Math.floor(Math.random() * colors.length)];
  document.getElementById('prediction').textContent = prediction;
  const actual = colors[Math.floor(Math.random() * colors.length)];
  const status = prediction === actual ? 'WIN' : 'LOSS';
  const li = document.createElement('li');
  li.className = 'p-2 bg-gray-100 rounded flex justify-between';
  li.innerHTML = `<span>${new Date().toLocaleTimeString()}</span> <span>${prediction}</span> <span>${actual}</span> <span class="${status === 'WIN' ? 'text-green-500' : 'text-red-500'}">${status}</span>`;
  document.getElementById('historyList').prepend(li);
}
