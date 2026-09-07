import english from './locales/en-US.ui.json' with { type: 'json' }
import simplifiedChinese from './locales/zh-CN.ui.json' with { type: 'json' }
import traditionalChinese from './locales/zh-TW.ui.json' with { type: 'json' }

export const locales = {
  root: english,
  'zh-CN': simplifiedChinese,
  'zh-TW': traditionalChinese
}
