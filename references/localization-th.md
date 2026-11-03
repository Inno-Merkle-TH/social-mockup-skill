# Thai localisation notes

- **Fonts**: Thai UI on Android = loopless sans (Noto Sans Thai, bundled; SamsungOne Thai on Galaxy if licensed). iOS = **Thonburi** (looped; what LINE/FB/TikTok show on iPhone, verified on device). It comes through `system-ui` on macOS. The fallback elsewhere is Noto Sans Thai Looped (bundled). Brand fonts are only for text inside images, and often lack Thai glyphs, so pair brand Latin with a Thai fallback in `--brand-head` / `--brand-body`.
- **Line breaks**: Thai has no spaces between words; browsers break by dictionary but can split badly in narrow bubbles. Insert `<wbr>` or a zero-width space (`&#8203;`) between words where breaks look wrong, and `white-space: nowrap` for prices/dates ("4–24 มี.ค.").
- **Year**: Thai consumer copy often uses the Buddhist Era (BE = CE + 543 → 2026 = 2569, 2027 = 2570). Pick one per project and record it in notes.md. Status bars/lock screens use the phone's calendar setting (usually Gregorian numbers with Thai month names).
- **Dates**: "ศุกร์ 26 มีนาคม", short "26 มี.ค.". Weekday must be correct for the year.
- **Price**: ฿1,290 or 1,290 บาท (pick one per project). Thousands separator always.
- **Tone**: LINE OA messages use polite particles (ค่ะ/ครับ) consistently per brand persona. FB/TikTok ad copy is shorter and punchier, often mixing English product names.
- **Native CTA buttons (Thai UI)**, from the platforms' fixed lists. Verify against Ads Manager preview:
  - Meta: Shop now = ซื้อเลย, Learn more = ดูข้อมูลเพิ่มเติม, Sign up = ลงทะเบียน, Book now = จองเลย, Get offer = รับข้อเสนอ, Order now = สั่งซื้อเลย, Contact us = ติดต่อเรา, Send message = ส่งข้อความ, Download = ดาวน์โหลด
  - TikTok: Shop now = ซื้อเลย, Learn more = ดูข้อมูลเพิ่มเติม, Order now = สั่งเลย, Download = ดาวน์โหลด, Sign up = ลงทะเบียน, Book now = จองเลย
- **TikTok app (Thai)**: bottom nav หน้าหลัก / ร้านค้า / + / กล่องข้อความ / โปรไฟล์; caption "more" = เพิ่มเติม; Sponsored = ได้รับการสนับสนุน.
- **Platform UI strings (Thai)**: Sponsored = ได้รับการสนับสนุน; See more = ดูเพิ่มเติม; Like/Comment/Share = ถูกใจ/แสดงความคิดเห็น/แชร์; LINE "Read" = อ่านแล้ว; "Today" = วันนี้; TikTok For You/Following = สำหรับคุณ/กำลังติดตาม. Verify against `references/screens/` because app wording changes.
