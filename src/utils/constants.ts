import { SuperCommitConfig } from "../types/config";

export const DEFAULT_CONFIG: SuperCommitConfig = {
  language: "en",
  types: [
    {
      value: "feat",
      name: "feat: A new feature",
      description: "Introduces a new feature to the codebase",
      emoji: "✨",
    },
    {
      value: "fix",
      name: "fix: A bug fix",
      description: "Patches a bug in your codebase",
      emoji: "🐛",
    },
    {
      value: "docs",
      name: "docs: Documentation only changes",
      description: "Changes to documentation only",
      emoji: "📚",
    },
    {
      value: "style",
      name: "style: Changes that do not affect the meaning of the code",
      description:
        "Code style changes (white-space, formatting, missing semi-colons, etc)",
      emoji: "💎",
    },
    {
      value: "refactor",
      name: "refactor: A code change that neither fixes a bug nor adds a feature",
      description: "Code refactoring without changing functionality",
      emoji: "📦",
    },
    {
      value: "perf",
      name: "perf: A code change that improves performance",
      description: "Performance improvements",
      emoji: "🚀",
    },
    {
      value: "test",
      name: "test: Adding missing tests or correcting existing tests",
      description: "Adding or updating tests",
      emoji: "🚨",
    },
    {
      value: "build",
      name: "build: Changes that affect the build system or external dependencies",
      description: "Build system or dependency changes",
      emoji: "🛠️",
    },
    {
      value: "ci",
      name: "ci: Changes to our CI configuration files and scripts",
      description: "Continuous integration changes",
      emoji: "⚙️",
    },
    {
      value: "chore",
      name: "chore: Other changes that don't modify src or test files",
      description: "Other changes that don't modify source or test files",
      emoji: "♻️",
    },
    {
      value: "revert",
      name: "revert: Reverts a previous commit",
      description: "Reverts a previous commit",
      emoji: "🗑️",
    },
  ],
  scopes: [
    { value: "api", name: "api: API related changes" },
    { value: "ui", name: "ui: User interface changes" },
    { value: "db", name: "db: Database related changes" },
    { value: "config", name: "config: Configuration changes" },
    { value: "deps", name: "deps: Dependency updates" },
  ],
  validation: {
    subjectMaxLength: 72,
    subjectMinLength: 1,
    bodyMaxLineLength: 100,
    typeRequired: true,
    scopeRequired: false,
    subjectRequired: true,
    allowCustomScopes: true,
    allowEmptyBody: true,
  },
  promptMessages: {
    type: "Select the type of change that you're committing:",
    scope: "Denote the SCOPE of this change (optional):",
    customScope: "Enter a custom scope:",
    subject: "Write a SHORT, IMPERATIVE tense description of the change:",
    body: "Provide a LONGER description of the change (optional):",
    breaking: "Are there any breaking changes?",
    breakingBody: "Describe the breaking changes:",
    issues: 'Add issue references (e.g. "fix #123", "re #456"):',
  },
  format: {
    useEmoji: false,
    emojiPosition: "before-type",
    separator: ":",
    lineBreaksBetweenSections: 1,
  },
};

export const DEFAULT_CONFIG_TR: SuperCommitConfig = {
  language: "tr",
  types: [
    {
      value: "feat",
      name: "feat: Yeni bir özellik",
      description: "Kod tabanına yeni bir özellik ekler",
      emoji: "✨",
    },
    {
      value: "fix",
      name: "fix: Hata düzeltme",
      description: "Kod tabanındaki bir hatayı düzeltir",
      emoji: "🐛",
    },
    {
      value: "docs",
      name: "docs: Sadece dokümantasyon değişiklikleri",
      description: "Sadece dokümantasyon değişiklikleri",
      emoji: "📚",
    },
    {
      value: "style",
      name: "style: Kodun anlamını etkilemeyen değişiklikler",
      description:
        "Kod stili değişiklikleri (boşluk, formatlama, noktalı virgül, vb.)",
      emoji: "💎",
    },
    {
      value: "refactor",
      name: "refactor: Hata düzeltmeyen ve özellik eklemeyen kod değişikliği",
      description: "İşlevselliği değiştirmeyen kod yeniden yapılandırması",
      emoji: "📦",
    },
    {
      value: "perf",
      name: "perf: Performansı iyileştiren kod değişikliği",
      description: "Performans iyileştirmeleri",
      emoji: "🚀",
    },
    {
      value: "test",
      name: "test: Eksik testleri ekleme veya mevcut testleri düzeltme",
      description: "Test ekleme veya güncelleme",
      emoji: "🚨",
    },
    {
      value: "build",
      name: "build: Derleme sistemini veya dış bağımlılıkları etkileyen değişiklikler",
      description: "Derleme sistemi veya bağımlılık değişiklikleri",
      emoji: "🛠️",
    },
    {
      value: "ci",
      name: "ci: CI yapılandırma dosyaları ve scriptlerinde değişiklikler",
      description: "Sürekli entegrasyon değişiklikleri",
      emoji: "⚙️",
    },
    {
      value: "chore",
      name: "chore: Kaynak veya test dosyalarını değiştirmeyen diğer değişiklikler",
      description:
        "Kaynak veya test dosyalarını değiştirmeyen diğer değişiklikler",
      emoji: "♻️",
    },
    {
      value: "revert",
      name: "revert: Önceki bir commit'i geri alır",
      description: "Önceki bir commit'i geri alır",
      emoji: "🗑️",
    },
  ],
  scopes: [
    { value: "api", name: "api: API ile ilgili değişiklikler" },
    { value: "ui", name: "ui: Kullanıcı arayüzü değişiklikleri" },
    { value: "db", name: "db: Veritabanı ile ilgili değişiklikler" },
    { value: "config", name: "config: Yapılandırma değişiklikleri" },
    { value: "deps", name: "deps: Bağımlılık güncellemeleri" },
  ],
  validation: {
    subjectMaxLength: 72,
    subjectMinLength: 1,
    bodyMaxLineLength: 100,
    typeRequired: true,
    scopeRequired: false,
    subjectRequired: true,
    allowCustomScopes: true,
    allowEmptyBody: true,
  },
  promptMessages: {
    type: "Yaptığınız değişikliğin türünü seçin:",
    scope: "Bu değişikliğin KAPSAMINI belirtin (opsiyonel):",
    customScope: "Özel bir kapsam girin:",
    subject: "Değişikliğin KISA, EMİR KİPİNDE bir açıklamasını yazın:",
    body: "Değişikliğin DAHA UZUN bir açıklamasını yazın (opsiyonel):",
    breaking: "Herhangi bir breaking change var mı?",
    breakingBody: "Breaking change'leri açıklayın:",
    issues: 'Issue referansları ekleyin (örn. "fix #123", "re #456"):',
  },
  format: {
    useEmoji: false,
    emojiPosition: "before-type",
    separator: ":",
    lineBreaksBetweenSections: 1,
  },
};

export const CONFIG_FILE_NAME = ".supercommitrc.json";
export const CONFIG_MODULE_NAME = "supercommit";
