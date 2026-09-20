# DoseKey E2E Testleri

Playwright ile yazılmış uçtan uca testler. Android Chrome ve masaüstü Chrome
olmak üzere iki tarayıcı profilinde, toplam 12 test koşar.

## Nasıl çalışır

Bu klasör DoseKey deposunun içinde durur. Testler koşarken Playwright üst
klasördeki uygulamayı kendisi derler, `http://localhost:4173` adresinde servis
eder, testleri koşar ve bitince kapatır. Ayrı bir sunucu başlatmana gerek yok.

Canlı adres (`dosekey-tracker...chatgpt.site`) ChatGPT girişinin arkasında
olduğu için testler oraya erişemez. Uygulama verilerini tarayıcının
`localStorage` alanında tuttuğundan arka uç sunucusuna ihtiyaç duymaz ve
yerelde eksiksiz çalışır.

## Kurulum

Depo kökünde, bir kez:

```bash
pnpm install
```

Bu klasörde:

```bash
npm ci
npx playwright install chromium
```

## Komutlar

Hepsi bu klasörden çalıştırılır.

| Komut | Ne yapar |
| --- | --- |
| `npm run test:all` | 12 testin tamamı, iki tarayıcı profili |
| `npm run test:android` | Sadece Android Chrome, 6 test |
| `npm run test:desktop` | Sadece masaüstü Chrome, 6 test |
| `npm run test:headed` | Tarayıcıyı görerek koşar |
| `npm run typecheck` | Tarayıcı açmadan testleri derler |
| `npm run report` | Son HTML raporu açar |

Tek bir testi izleyerek koşmak, sorun ararken en kullanışlısı:

```bash
npm run test:headed -- --workers=1
```

## Başka bir adrese karşı koşmak

Komut satırında verilen `BASE_URL` her şeyi ezer ve yerel sunucuyu devre dışı
bırakmaz, sadece testlerin gideceği adresi değiştirir:

```bash
BASE_URL=http://localhost:3000 npm run test:all
```

Uygulama başka bir klasördeyse:

```bash
APP_DIR=../baska/klasor npm run test:all
```

`.env` dosyası oluşturma. İçindeki `BASE_URL` yerel kurulumu geçersiz kılar.

## GitHub Actions

`.github/workflows/dosekey-e2e.yml` her push ve pull request'te 12 testi
koşar. Uygulamayı derleyip yerelde servis ettiği için giriş duvarına takılmaz.
Testler kalırsa HTML rapor, ekran görüntüleri, videolar ve trace dosyaları
koşunun "Artifacts" bölümünden indirilebilir.

## Testler ne kapsıyor

- Onboarding: yeni kullanıcının ilaç, doz, sıklık seçip planını oluşturması
- Doz kaydı ekleme, geçmişten detayını açma ve silme
- Günlük kayıt ekleme, kilo girme ve sonradan düzenleme
- İlerleme ortalamasının yalnızca bugünün kayıtlarından hesaplanması
- Kayıt saatlerinin detay ekranında doğru görünmesi
- Profil görüntüleme ve düzenleme
- Alt menüdeki dört sekmenin açılması
