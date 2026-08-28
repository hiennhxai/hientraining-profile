"use server";

import { supabase } from "../lib/supabase";
import { LeadItem } from "../types";

import { headers } from "next/headers";

// In-memory rate limiter for server actions (3 requests per 5 minutes)
const RATE_LIMIT_WINDOW = 5 * 60 * 1000;
const MAX_REQUESTS = 3;
const leadRateLimitMap = new Map<string, { count: number; resetTime: number }>();

export async function submitLead(name: string, phone: string, source: string, email?: string) {
  try {
    // SECURITY 0: Rate Limiting
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || 'anonymous_lead';
    const now = Date.now();
    const userRate = leadRateLimitMap.get(ip);
    
    if (userRate) {
      if (now > userRate.resetTime) {
        leadRateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
      } else {
        if (userRate.count >= MAX_REQUESTS) {
          throw new Error("Bạn đã đăng ký quá nhiều lần. Vui lòng thử lại sau 5 phút.");
        }
        userRate.count += 1;
        leadRateLimitMap.set(ip, userRate);
      }
    } else {
      leadRateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    }

    // Cleanup to prevent Memory Leak
    if (leadRateLimitMap.size > 500) {
      for (const [key, value] of leadRateLimitMap.entries()) {
        if (now > value.resetTime) {
          leadRateLimitMap.delete(key);
        }
      }
    }

    // SECURITY 1: Basic length limits
    if (name?.length > 100) throw new Error("Tên quá dài");
    if (phone?.length > 20) throw new Error("Số điện thoại không hợp lệ");
    if (source?.length > 200) throw new Error("Nguồn quá dài");
    if (email && email.length > 100) throw new Error("Email quá dài");

    // SECURITY 2: Basic HTML strip (Sanitization) to prevent XSS payloads
    const sanitize = (str: string) => str ? str.replace(/[<>]/g, '') : '';
    const safeName = sanitize(name);
    const safePhone = sanitize(phone);
    const safeSource = sanitize(source);
    const safeEmail = sanitize(email || '');
    const { error: insertError } = await supabase
      .from("leads")
      .insert([
        {
          name: safeName,
          phone: safePhone,
          email: safeEmail || null,
          course_interest: safeSource, // We map source to course_interest based on the SQL schema
        }
      ]);

    if (insertError) {
      throw insertError;
    }

    return { success: true };
  } catch (error: any) {
    console.error("Lỗi khi lưu Lead:", error);
    return { success: false, message: error?.message || "Có lỗi xảy ra" };
  }
}
