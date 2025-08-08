// 完整的前端页面测试
const API_BASE_URL = 'https://api.sparkvideo.cc/api';
const SITE_URL = 'http://localhost:3002';

console.log('🚀 SparkVideo Frontend Testing');
console.log('=====================================\n');
console.log('API Base:', API_BASE_URL);
console.log('Site URL:', SITE_URL);
console.log('\n📋 Available Pages:\n');

const pages = [
  { path: '/', name: '🏠 Home Page', desc: 'Landing page with hero, features, pricing' },
  { path: '/zh', name: '🇨🇳 Chinese Home', desc: 'Chinese version of home page' },
  { path: '/en', name: '🇬🇧 English Home', desc: 'English version of home page' },
  { path: '/login', name: '🔐 Login', desc: 'User authentication page' },
  { path: '/register', name: '📝 Register', desc: 'New user registration' },
  { path: '/video', name: '🎬 Video Processing', desc: 'Upload and process videos' },
  { path: '/audio', name: '🎵 Audio Processing', desc: 'Audio transcription and conversion' },
  { path: '/documents', name: '📄 Documents', desc: 'Document management' },
  { path: '/blog', name: '📰 Blog', desc: 'Blog posts and articles' },
  { path: '/pricing', name: '💰 Pricing', desc: 'Subscription plans' },
  { path: '/dashboard', name: '📊 Dashboard', desc: 'User dashboard (requires login)' },
];

pages.forEach(page => {
  console.log(`${page.name} - ${SITE_URL}${page.path}`);
  console.log(`   ${page.desc}\n`);
});

console.log('=====================================');
console.log('\n🧪 Testing API Endpoints:\n');

async function testEndpoints() {
  // Test public endpoints
  const publicTests = [
    {
      name: 'Subscription Plans',
      url: `${API_BASE_URL}/v1/subscription/plans`,
      method: 'GET'
    },
    {
      name: 'Blog Posts',
      url: `${API_BASE_URL}/v1/blog?limit=1`,
      method: 'GET'
    }
  ];

  for (const test of publicTests) {
    try {
      console.log(`Testing ${test.name}...`);
      const response = await fetch(test.url, { method: test.method });
      console.log(`   Status: ${response.status} ${response.status === 200 ? '✅' : '⚠️'}`);
      
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          console.log(`   Data: ${data.length} items returned`);
        } else {
          console.log(`   Data: Response received`);
        }
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    console.log('');
  }

  // Test authentication endpoint
  console.log('Testing Authentication...');
  try {
    const loginResponse = await fetch(`${API_BASE_URL}/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpassword'
      })
    });
    console.log(`   Login endpoint: ${loginResponse.status === 401 ? '✅ Properly secured' : loginResponse.status}`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
}

testEndpoints().then(() => {
  console.log('\n=====================================');
  console.log('✅ Testing Complete!\n');
  console.log('📌 Next Steps:');
  console.log('1. Visit the pages listed above to test functionality');
  console.log('2. Try registering a new account');
  console.log('3. Test video/audio upload features');
  console.log('4. Check language switching (中文/English)');
  console.log('5. Verify responsive design on mobile');
  console.log('\n🚀 Run the dev server with: npm run dev');
  console.log('=====================================');
});