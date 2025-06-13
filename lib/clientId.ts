import { v4 as uuidv4 } from 'uuid';

// دالة لاسترجاع معرف العميل من localStorage أو إنشاؤه إذا لم يكن موجودًا
export function getClientId(): string {
  if (typeof window === 'undefined') return ''; // في حالة SSR لأن localStorage غير متوفر على السيرفر، لذا نتجنب الخطأ هنا بإرجاع سلسلة فارغة

  let clientId = localStorage.getItem('client_id');
  if (!clientId) {
    clientId = uuidv4(); // توليد UUID جديد
    localStorage.setItem('client_id', clientId); // تخزين في localStorage
  }
  return clientId;
}
