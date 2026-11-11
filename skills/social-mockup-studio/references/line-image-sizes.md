# LINE image sizes, by sending route (with sources)

Researched 2026-11-04. **Rule: any platform limit stated to a user needs ≥ 2 sources. When sources conflict, say so and use the safest option.** Re-check sources older than ~12 months before quoting them.

Check every uploaded or composed image before use:
`python3 scripts/clean_image.py <img> --for line-richmsg` (or `line-flex-hero`, `line-richmenu-large`, `line-richmenu-compact`, `line-card`, `line-image`).
kit.js also raises a QA issue for any `.ln-imap` that isn't square, unless the shape was confirmed and `data-size-ok="…"` is set on it.

## Rich message (imagemap)

**Default: 1040×1040 (square).** This is the only size every source agrees on, and the only OA Manager layout with several tap areas. Any other shape is an exception: ask the user which template or route they use, then record it in notes.md.

| Route | Width | Height | Areas | File | Sources |
|---|---|---|---|---|---|
| **Messaging API** (dev team / bot) | base 1040 (also serve 240, 300, 460, 700 at `baseUrl/{w}`) | any; "the height that corresponds to a width of 1040" | ≤ 50 actions | JPEG/PNG ≤ 10 MB, transparent PNG allowed | [LINE API reference: imagemap][api] · [Treasure Data][td] (width must be exactly 1040, height any positive integer) |
| **OA Manager: square** | 1040 | 1040 | grid templates, several areas | JPG/PNG ≤ 10 MB | [Capillary][cap] · [ligla.jp][ligla] (cites the OA Manager manual) · [Zaapi][zaapi] |
| **OA Manager: horizontal** (large / medium / small) | 1040 | 700 / 585 / 350 | template | JPG/PNG ≤ 10 MB | [ligla.jp][ligla] only. ⚠ **single source**: confirm in the user's OA Manager template picker |
| **OA Manager: vertical** | 1040 | 1300 / 1850 | template | JPG/PNG ≤ 10 MB | [ligla.jp][ligla] only. ⚠ **single source** |
| **OA Manager: custom** | 1040 | **520–2080** (one source says **250–2080**) | **1** area only | JPG/PNG ≤ 10 MB | 520: [Capillary][cap], [ligla.jp][ligla], [Fastclick][fc] · 250: [Zaapi 2024][zaapi]. ⚠ **Conflict**: use ≥ 520 (it works under both readings) |
| **Braze** (CRM) | not stated | **1:1 only** | template | PNG (transparency allowed) / JPEG ≤ 10 MB | [Braze LINE message types][braze] |
| **Capillary** (CRM) | 1040 | 1040, or custom 520–2080 | square: grid; custom: 1 | not stated | [Capillary][cap] |

Notes:
- 2500×1686 and 2500×843 are **rich menu** sizes, not rich message sizes. Mixing them up is a common rework cause ([ligla.jp][ligla]).
- OA Manager can't crop after upload. Deliver the exact pixel size ([ligla.jp][ligla]).

## Rich menu

| Item | Value | Sources |
|---|---|---|
| Sizes | 2500×1686, 2500×843, 1200×810, 1200×405, 800×540, 800×270 (OA Manager) | [Zaapi][zaapi] · [LINE API][api] (any size in range) |
| API range | width 800–2500, height ≥ 250, **width/height ≥ 1.45** | [LINE API: rich menu image][api] |
| File | JPEG/PNG **≤ 1 MB** | [LINE API][api] · [Zaapi][zaapi] |
| Areas | ≤ 20 (API); OA Manager: only its 12 templates | [LINE API][api] · intake.md Round 3b |

## Flex Message image (hero, image component)

| Item | Value | Sources |
|---|---|---|
| aspectRatio | `{w}:{h}`, each 1–100000, **height ≤ 3× width**; default 1:1 | [LINE API: Flex image][api] |
| File | JPEG/PNG, **max 1024×1024 px**, ≤ 10 MB (300 KB if animated) | [LINE API: Flex image][api] |
| Common hero ratios | 20:13, 1.51:1, 1.91:1, 1:1 | LINE Flex Simulator templates · kit default 20:13 (`typography-and-ratios.md`). ⚠ Convention, not a limit |

## Image message, card-based message

| Item | Value | Sources |
|---|---|---|
| Image message | JPEG/PNG ≤ 10 MB; preview ≤ 1 MB; any ratio | [LINE API: image message][api] · [Braze][braze] · [Zaapi][zaapi] |
| Card-based (carousel) | 1.51:1 or 1:1; ≤ 10 cards | [Braze][braze] (1024 wide, ≤ 1 MB) · [Zaapi][zaapi] (products 1848×1200, ≤ 10 MB). ⚠ **Conflict on file size**: keep ≤ 1 MB |

## Sources

[api]: https://developers.line.biz/en/reference/messaging-api/ "LINE Messaging API reference (imagemap, image, rich menu, Flex image), read 2026-11-04"
[td]: https://docs.treasure.ai/products/marketing-cloud/engage-studio/channels/line/line-oa-message-types "Treasure Data Engage Studio: LINE OA message types"
[cap]: https://docs.capillarytech.com/docs/configure-line-content "Capillary: Configure LINE content"
[ligla]: https://ligla.jp/blog/delivery/rich-size/ "ligla.jp: rich message sizes (cites the OA Manager manual)"
[zaapi]: https://www.zaapi.com/th/blog/line-media-size-2024 "Zaapi: LINE OA media sizes 2024 (TH)"
[fc]: https://fastclick.co.th/lineoa-image-size/ "Fastclick: LINE OA image sizes 2023 (TH)"
[braze]: https://braze.com/docs/user_guide/message_building_by_channel/line/create/message_types "Braze: LINE message types"

- LINE Messaging API reference: <https://developers.line.biz/en/reference/messaging-api/>
- Treasure Data: <https://docs.treasure.ai/products/marketing-cloud/engage-studio/channels/line/line-oa-message-types>
- Capillary: <https://docs.capillarytech.com/docs/configure-line-content>
- ligla.jp: <https://ligla.jp/blog/delivery/rich-size/>
- Zaapi: <https://www.zaapi.com/th/blog/line-media-size-2024>
- Fastclick: <https://fastclick.co.th/lineoa-image-size/>
- Braze: <https://braze.com/docs/user_guide/message_building_by_channel/line/create/message_types>
