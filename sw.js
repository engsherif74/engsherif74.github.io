// Service Worker بسيط لتطبيق تحصيل المديونيات
const CACHE = "collect-app-v1";

// تجاهل طلبات التثبيت الفاشلة
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// فعّل التحديث الفوري
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// معالج fetch بسيط (مطلوب لتفعيل التثبيت على أندرويد)
self.addEventListener('fetch', (event) => {
  // لا نتدخل — اترك المتصفح يجلب كل شيء عادة
  // هذا المعالج يكفي فقط لتجاوز شرط Chrome للتثبيت
});

// دعم رسائل SKIP_WAITING (اختياري)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
