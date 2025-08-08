// 测试 API 连接性
const API_BASE_URL = 'https://api.sparkvideo.cc/api';

async function testAPIConnection() {
  console.log('🔍 Testing API connection to:', API_BASE_URL);
  console.log('=====================================\n');

  // 测试基础连接
  try {
    console.log('1. Testing root endpoint...');
    const rootResponse = await fetch(API_BASE_URL.replace('/api', ''));
    console.log('   Status:', rootResponse.status);
    const rootData = await rootResponse.json();
    console.log('   Response:', rootData);
    console.log('   ✅ Root endpoint accessible\n');
  } catch (error) {
    console.log('   ❌ Root endpoint error:', error.message, '\n');
  }

  // 测试健康检查
  try {
    console.log('2. Testing health check...');
    const healthResponse = await fetch(API_BASE_URL.replace('/api', '/health'));
    console.log('   Status:', healthResponse.status);
    const healthData = await healthResponse.json();
    console.log('   Response:', healthData);
    console.log('   ✅ Health check passed\n');
  } catch (error) {
    console.log('   ❌ Health check error:', error.message, '\n');
  }

  // 测试订阅计划（公开端点）
  try {
    console.log('3. Testing subscription plans endpoint...');
    const plansResponse = await fetch(`${API_BASE_URL}/v1/subscription/plans`);
    console.log('   Status:', plansResponse.status);
    if (plansResponse.ok) {
      const plansData = await plansResponse.json();
      console.log('   Plans found:', plansData.length);
      console.log('   ✅ Subscription plans accessible\n');
    } else {
      console.log('   ⚠️ Subscription plans returned:', plansResponse.status, '\n');
    }
  } catch (error) {
    console.log('   ❌ Subscription plans error:', error.message, '\n');
  }

  // 测试博客列表（公开端点）
  try {
    console.log('4. Testing blog posts endpoint...');
    const blogResponse = await fetch(`${API_BASE_URL}/v1/blog?limit=5`);
    console.log('   Status:', blogResponse.status);
    if (blogResponse.ok) {
      const blogData = await blogResponse.json();
      console.log('   Response type:', typeof blogData);
      console.log('   ✅ Blog posts accessible\n');
    } else {
      console.log('   ⚠️ Blog posts returned:', blogResponse.status, '\n');
    }
  } catch (error) {
    console.log('   ❌ Blog posts error:', error.message, '\n');
  }

  // 测试 CORS 配置
  console.log('5. Testing CORS configuration...');
  try {
    const corsResponse = await fetch(`${API_BASE_URL}/v1/auth/login`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type',
      }
    });
    console.log('   CORS Preflight Status:', corsResponse.status);
    const corsHeaders = {
      'Access-Control-Allow-Origin': corsResponse.headers.get('access-control-allow-origin'),
      'Access-Control-Allow-Methods': corsResponse.headers.get('access-control-allow-methods'),
      'Access-Control-Allow-Headers': corsResponse.headers.get('access-control-allow-headers'),
    };
    console.log('   CORS Headers:', corsHeaders);
    if (corsHeaders['Access-Control-Allow-Origin']) {
      console.log('   ✅ CORS is properly configured\n');
    } else {
      console.log('   ⚠️ CORS might need configuration\n');
    }
  } catch (error) {
    console.log('   ❌ CORS test error:', error.message, '\n');
  }

  console.log('=====================================');
  console.log('API Connection Test Complete!');
}

// 运行测试
testAPIConnection().catch(console.error);