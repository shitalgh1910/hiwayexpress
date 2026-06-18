import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import bcrypt from 'bcryptjs'
import path from 'path'

const rawUrl = process.env.DATABASE_URL ?? 'file:./dev.db'
const dbPath = rawUrl.startsWith('file:')
  ? path.resolve(rawUrl.replace('file:', ''))
  : rawUrl
const adapter = new PrismaBetterSqlite3({ url: dbPath })
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const passwordHash = await bcrypt.hash('highway2024', 10)
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@highwayexpress.com.np',
      passwordHash,
      role: 'admin',
    },
  })
  console.log('✅ Admin user created (username: admin, password: highway2024)')

  // Create categories
  const categories = [
    { name: 'Dang News', nameNepali: 'दाङ समाचार', slug: 'dang-news', description: 'दाङका स्थानीय समाचार' },
    { name: 'Nepal News', nameNepali: 'नेपाल समाचार', slug: 'nepal-news', description: 'राष्ट्रिय समाचार' },
    { name: 'Politics', nameNepali: 'राजनीति', slug: 'politics', description: 'राजनीतिक समाचार' },
    { name: 'Society', nameNepali: 'समाज', slug: 'society', description: 'सामाजिक समाचार' },
    { name: 'Economy', nameNepali: 'अर्थतन्त्र', slug: 'economy', description: 'आर्थिक समाचार' },
    { name: 'Education', nameNepali: 'शिक्षा', slug: 'education', description: 'शिक्षा सम्बन्धी समाचार' },
    { name: 'Health', nameNepali: 'स्वास्थ्य', slug: 'health', description: 'स्वास्थ्य समाचार' },
    { name: 'Sports', nameNepali: 'खेलकुद', slug: 'sports', description: 'खेलकुद समाचार' },
    { name: 'Entertainment', nameNepali: 'मनोरञ्जन', slug: 'entertainment', description: 'मनोरञ्जन समाचार' },
    { name: 'Interviews', nameNepali: 'अन्तर्वार्ता', slug: 'interviews', description: 'अन्तर्वार्ता' },
    { name: 'Opinion', nameNepali: 'मत / विचार', slug: 'opinion', description: 'मत र विचार' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log('✅ Categories created')

  const dangCat = await prisma.category.findUnique({ where: { slug: 'dang-news' } })
  const nepalCat = await prisma.category.findUnique({ where: { slug: 'nepal-news' } })
  const politicsCat = await prisma.category.findUnique({ where: { slug: 'politics' } })
  const societyCat = await prisma.category.findUnique({ where: { slug: 'society' } })
  const healthCat = await prisma.category.findUnique({ where: { slug: 'health' } })
  const educationCat = await prisma.category.findUnique({ where: { slug: 'education' } })
  const sportsCat = await prisma.category.findUnique({ where: { slug: 'sports' } })
  const economyCat = await prisma.category.findUnique({ where: { slug: 'economy' } })
  const interviewsCat = await prisma.category.findUnique({ where: { slug: 'interviews' } })
  const opinionCat = await prisma.category.findUnique({ where: { slug: 'opinion' } })

  const now = new Date()

  const articles = [
    {
      title: 'दाङमा विकास निर्माणले गति लिँदै',
      slug: 'dang-ma-bikas-nirman-le-gati-lindai',
      summary: 'दाङ जिल्लामा सडक, पुल र सिँचाइ आयोजनाहरूले नयाँ गति लिएको छ। घोराहीदेखि तुलसीपुर सम्मको सडक चौडाइकरणको काम अन्तिम चरणमा पुगेको छ।',
      content: `<p>दाङ जिल्लामा पछिल्लो समय विकास निर्माणका कामहरूले उल्लेखनीय गति लिएको छ। जिल्लाभर सडक, पुल, सिँचाइ र खानेपानी आयोजनाहरू तीव्र गतिमा निर्माण भइरहेका छन्।</p>

<p>घोराही उपमहानगरपालिकाले आर्थिक वर्ष २०८१/०८२ मा विभिन्न पूर्वाधार निर्माणका लागि ठूलो बजेट विनियोजन गरेको छ। नगरका प्रमुख सडकहरू फराकिलो बनाउने काम भइरहेको छ।</p>

<h2>सडक निर्माणको स्थिति</h2>
<p>घोराहीदेखि तुलसीपुर जोड्ने मुख्य राजमार्गको चौडाइकरण कार्य अन्तिम चरणमा पुगेको छ। यस सडकको निर्माण सम्पन्न भएपछि दुवै शहरबीचको यात्रा सहज हुनेछ।</p>

<h2>पुल निर्माण</h2>
<p>बबई नदीमा नयाँ पुल निर्माणको काम पनि तीव्र रूपमा भइरहेको छ। यस पुलले दाङका पूर्वी र पश्चिमी भागका बासिन्दाहरूलाई जोड्नेछ।</p>

<p>जिल्ला समन्वय समितिका प्रमुखले भने, "हामी विकास निर्माणका कामहरूलाई प्राथमिकता दिइरहेका छौं। आगामी वर्षभित्र अधिकांश आयोजना सम्पन्न हुनेछन्।"</p>`,
      categoryId: dangCat?.id,
      author: 'KP Ghimire',
      status: 'published',
      featured: true,
      breaking: true,
      views: 245,
      publishedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
    },
    {
      title: 'नेपाल सरकारले नयाँ आर्थिक नीति घोषणा गर्यो',
      slug: 'nepal-sarkar-le-naya-arthik-niti-ghoshana-garo',
      summary: 'नेपाल सरकारले आर्थिक वर्ष २०८१/०८२ का लागि नयाँ आर्थिक नीति घोषणा गरेको छ। यस नीतिमा कृषि, उद्योग र पर्यटनलाई विशेष प्राथमिकता दिइएको छ।',
      content: `<p>नेपाल सरकारले आगामी आर्थिक वर्षका लागि महत्त्वपूर्ण आर्थिक नीतिहरू घोषणा गरेको छ। अर्थ मन्त्रालयले जारी गरेको यस नीतिमा देशको आर्थिक विकासलाई गति दिने विभिन्न कार्यक्रमहरू समावेश छन्।</p>

<h2>कृषि क्षेत्रमा लगानी</h2>
<p>सरकारले कृषि क्षेत्रमा अघिल्लो वर्षको तुलनामा ३० प्रतिशत बढी बजेट विनियोजन गरेको छ। यसले किसानहरूको आम्दानी बढाउने र खाद्य सुरक्षा सुनिश्चित गर्ने अपेक्षा गरिएको छ।</p>

<h2>पर्यटन प्रवर्द्धन</h2>
<p>सरकारले आगामी वर्ष थप १० लाख पर्यटक आकर्षित गर्ने लक्ष्य राखेको छ। यसका लागि विभिन्न प्रचार-प्रसार कार्यक्रमहरू सञ्चालन गरिनेछन्।</p>

<p>अर्थमन्त्रीले संसदमा बोल्दै भने, "यो बजेटले नेपालको आर्थिक विकासमा नयाँ अध्याय थप्नेछ।"</p>`,
      categoryId: nepalCat?.id,
      author: 'KP Ghimire',
      status: 'published',
      featured: true,
      breaking: false,
      views: 189,
      publishedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
    },
    {
      title: 'प्रदेश सरकारको नयाँ मन्त्रिमण्डल गठन',
      slug: 'pradesh-sarkar-ko-naya-mantrimandal-gathan',
      summary: 'लुम्बिनी प्रदेश सरकारले नयाँ मन्त्रिमण्डल गठन गरेको छ। नयाँ मन्त्रिमण्डलमा दाङका दुई जना मन्त्री समावेश छन्।',
      content: `<p>लुम्बिनी प्रदेशमा नयाँ मन्त्रिमण्डल गठन भएको छ। प्रदेश प्रमुखले मुख्यमन्त्री र मन्त्रीहरूलाई शपथ ग्रहण गराएको छ।</p>

<h2>नयाँ मन्त्रिमण्डलको संरचना</h2>
<p>नवगठित मन्त्रिमण्डलमा विभिन्न राजनीतिक दलका प्रतिनिधिहरू समावेश छन्। यो मन्त्रिमण्डल गठबन्धन सरकारको रूपमा काम गर्नेछ।</p>

<h2>दाङका मन्त्रीहरू</h2>
<p>दाङ जिल्लाबाट दुई जना मन्त्रीहरू मन्त्रिमण्डलमा परेका छन्। उनीहरूले क्रमशः स्वास्थ्य र शिक्षा मन्त्रालयको जिम्मेवारी पाएका छन्।</p>

<p>नयाँ मुख्यमन्त्रीले पदभार ग्रहण गर्दै भने, "हाम्रो सरकारले जनताको विश्वास कायम राख्ने काम गर्नेछ।"</p>`,
      categoryId: politicsCat?.id,
      author: 'KP Ghimire',
      status: 'published',
      featured: false,
      breaking: true,
      views: 312,
      publishedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
    },
    {
      title: 'दाङमा डेंगु संक्रमण बढ्दो, स्वास्थ्य विभागको सतर्कता',
      slug: 'dang-ma-dengu-sankraman-badhdo',
      summary: 'दाङ जिल्लामा डेंगुको संक्रमण बढ्दै गएको छ। स्वास्थ्य विभागले जनतालाई सतर्क हुन आग्रह गरेको छ।',
      content: `<p>दाङ जिल्लामा पछिल्लो केही हप्तामा डेंगु ज्वरोका बिरामीको संख्या बढेको छ। जिल्ला स्वास्थ्य कार्यालयका अनुसार यस महिना मात्र ५० भन्दा बढी डेंगुका केसहरू दर्ता भएका छन्।</p>

<h2>लक्षणहरू र उपचार</h2>
<p>डेंगु ज्वरोका लक्षणहरूमा तीव्र ज्वरो, टाउको दुखाइ, जोर्नी दुखाइ र छालामा रातो दाग पर्नु प्रमुख छन्। बिरामीलाई तुरुन्त नजिकको स्वास्थ्य केन्द्रमा जान सुझाव दिइएको छ।</p>

<h2>रोकथामका उपायहरू</h2>
<ul>
<li>घरवरपर पानी जम्न नदिनु</li>
<li>लामखुट्टेको टोकाइबाट बच्नु</li>
<li>पूरा बाहुला भएका कपडा लगाउनु</li>
<li>मच्छरदानी प्रयोग गर्नु</li>
</ul>

<p>जिल्ला स्वास्थ्य अधिकारीले भने, "जनता सतर्क रहनुपर्छ र लक्षण देखिए तुरुन्त उपचार लिनुपर्छ।"</p>`,
      categoryId: healthCat?.id,
      author: 'KP Ghimire',
      status: 'published',
      featured: false,
      breaking: false,
      views: 178,
      publishedAt: new Date(now.getTime() - 8 * 60 * 60 * 1000),
    },
    {
      title: 'दाङका विद्यालयमा नयाँ शैक्षिक सत्र सुरु',
      slug: 'dang-ka-vidhyalayama-naya-shaikshik-sattra-suru',
      summary: 'दाङ जिल्लाका सरकारी र निजी विद्यालयहरूमा नयाँ शैक्षिक सत्र सुरु भएको छ। यस वर्ष विद्यार्थी भर्ना संख्यामा वृद्धि भएको छ।',
      content: `<p>दाङ जिल्लाका विद्यालयहरूमा नयाँ शैक्षिक सत्र आरम्भ भएको छ। जिल्लाभरका सरकारी र निजी विद्यालयहरूमा विद्यार्थीहरूको उत्साहजनक उपस्थिति रहेको छ।</p>

<h2>भर्ना अभियान</h2>
<p>यस वर्ष जिल्लाभरका विद्यालयहरूमा गत वर्षको तुलनामा १५ प्रतिशत बढी विद्यार्थी भर्ना भएका छन्। यसले शिक्षाप्रतिको जनसचेतना बढेको देखाउँछ।</p>

<h2>नयाँ सुविधाहरू</h2>
<p>घोराही माध्यमिक विद्यालयमा नयाँ विज्ञान प्रयोगशाला र पुस्तकालयको उद्घाटन भएको छ। यसले विद्यार्थीहरूको सिकाइ अनुभवलाई थप समृद्ध बनाउनेछ।</p>

<p>जिल्ला शिक्षा अधिकारीले भने, "हाम्रो लक्ष्य प्रत्येक बालबालिकालाई गुणस्तरीय शिक्षा प्रदान गर्नु हो।"</p>`,
      categoryId: educationCat?.id,
      author: 'KP Ghimire',
      status: 'published',
      featured: false,
      breaking: false,
      views: 134,
      publishedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
    },
    {
      title: 'दाङ क्रिकेट टिमले प्रदेश च्याम्पियनसिप जित्यो',
      slug: 'dang-cricket-timle-pradesh-championship-jityo',
      summary: 'दाङको क्रिकेट टिमले लुम्बिनी प्रदेश च्याम्पियनसिप जितेको छ। फाइनलमा दाङले रुपन्देहीलाई पाँच विकेटले पराजित गर्यो।',
      content: `<p>दाङको क्रिकेट टिमले ऐतिहासिक उपलब्धि हासिल गर्दै लुम्बिनी प्रदेश क्रिकेट च्याम्पियनसिप जितेको छ। बुटवलमा आयोजित फाइनल खेलमा दाङले रुपन्देहीलाई रोमाञ्चक मुकाबलामा पाँच विकेटले पराजित गर्यो।</p>

<h2>खेलको विवरण</h2>
<p>रुपन्देहीले पहिले ब्याटिङ गर्दै ४५ ओभरमा १८५ रन बनायो। दाङका बलरहरूले उत्कृष्ट प्रदर्शन गर्दै विपक्षी टिमलाई नियन्त्रणमा राखे।</p>

<p>जवाफी पारीमा दाङले ४२ ओभरमा लक्ष्य पार गर्यो। कप्तान प्रकाश थापाले ७५ रनको उत्कृष्ट पारी खेले।</p>

<h2>पुरस्कार समारोह</h2>
<p>विजेता टिमलाई प्रदेश सरकारको तर्फबाट नगद पुरस्कार र ट्रफी प्रदान गरियो।</p>

<p>कप्तान प्रकाश थापाले भने, "यो जित दाङका सबै क्रिकेटप्रेमीहरूलाई समर्पित छ।"</p>`,
      categoryId: sportsCat?.id,
      author: 'KP Ghimire',
      status: 'published',
      featured: false,
      breaking: false,
      views: 267,
      publishedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
    },
    {
      title: 'घोराहीमा नयाँ बजार केन्द्र निर्माण हुँदै',
      slug: 'ghorahima-naya-bazar-kendra-nirman-hundai',
      summary: 'घोराही उपमहानगरपालिकाले नयाँ बजार केन्द्र निर्माण गर्ने योजना अगाडि बढाएको छ। यस केन्द्रले स्थानीय व्यापारीहरूलाई ठूलो फाइदा पुर्‍याउनेछ।',
      content: `<p>घोराही उपमहानगरपालिकाले नयाँ बजार केन्द्र निर्माण गर्ने महत्त्वाकांक्षी योजना अगाडि बढाएको छ। यो बजार केन्द्र घोराहीको मध्यभागमा निर्माण गरिने र यहाँ ३०० भन्दा बढी पसलहरू रहनेछन्।</p>

<h2>आयोजनाको विवरण</h2>
<p>बहुतले बजार केन्द्रमा खुद्रा पसलहरू, खाद्यान्न बजार, कपडा बजार र इलेक्ट्रोनिक्स पसलहरू रहनेछन्। यसका साथै पार्किङ सुविधा र खाने ठाउँ पनि हुनेछ।</p>

<h2>रोजगारीका अवसर</h2>
<p>यस आयोजनाले कम्तीमा ५०० जना स्थानीय बासिन्दाहरूलाई प्रत्यक्ष रोजगारी दिने अपेक्षा गरिएको छ।</p>

<p>महानगरपालिकाका प्रमुखले भने, "यो बजार केन्द्रले घोराहीलाई व्यापारिक केन्द्रको रूपमा थप सुदृढ बनाउनेछ।"</p>`,
      categoryId: economyCat?.id,
      author: 'KP Ghimire',
      status: 'published',
      featured: false,
      breaking: false,
      views: 156,
      publishedAt: new Date(now.getTime() - 36 * 60 * 60 * 1000),
    },
    {
      title: 'KP Ghimireसँग विशेष अन्तर्वार्ता: दाङको पत्रकारिता र भविष्य',
      slug: 'kp-ghimire-sanga-vishesh-antarwarta',
      summary: 'अनुभवी पत्रकार तथा Radio Highway FM का पूर्व प्रबन्ध निर्देशक KP Ghimireसँग दाङको पत्रकारिताको वर्तमान अवस्था र भविष्यबारे विशेष अन्तर्वार्ता।',
      content: `<p><strong>प्रश्न:</strong> दाङको पत्रकारिताको वर्तमान अवस्थाबारे के भन्नुहुन्छ?</p>

<blockquote>दाङमा पत्रकारिताको क्षेत्र पछिल्लो दशकमा उल्लेखनीय रूपमा विकसित भएको छ। अनलाइन मिडियाको आगमनले स्थानीय समाचारहरू थप तीव्र र व्यापक रूपमा प्रसार हुन थालेका छन्। - KP Ghimire</blockquote>

<p><strong>प्रश्न:</strong> Radio Highway FM सञ्चालनको अनुभवबारे बताउनुस्।</p>

<blockquote>Radio Highway FM को स्थापना र सञ्चालन मेरो जीवनको सबैभन्दा महत्त्वपूर्ण अनुभवमध्ये एक हो। यो रेडियोले दाङका हजारौं श्रोताहरूसम्म पुग्ने मौका दियो। - KP Ghimire</blockquote>

<p><strong>प्रश्न:</strong> Highway Express सुरु गर्नुको उद्देश्य के थियो?</p>

<blockquote>डिजिटल युगमा पत्रकारिताको नयाँ अध्याय सुरु गर्नु नै मेरो मुख्य उद्देश्य हो। Highway Express मार्फत दाङका समाचारहरू देश-विदेशमा रहेका दाङवासीहरूसम्म पुर्‍याउन चाहन्छु। - KP Ghimire</blockquote>

<p>यस अन्तर्वार्तामा KP Ghimireले दाङको विकास, स्थानीय राजनीति र सामाजिक परिवर्तनबारे आफ्ना विचारहरू साझा गरे।</p>`,
      categoryId: interviewsCat?.id,
      author: 'Highway Express Team',
      status: 'published',
      featured: true,
      breaking: false,
      views: 423,
      publishedAt: new Date(now.getTime() - 48 * 60 * 60 * 1000),
    },
    {
      title: 'दाङमा महिला उद्यमीहरूको संगठन स्थापना',
      slug: 'dang-ma-mahila-udyamiharu-ko-sangathan-sthapana',
      summary: 'दाङमा महिला उद्यमीहरूले आफ्नै संगठन स्थापना गरेका छन्। यस संगठनको उद्देश्य महिलाहरूको आर्थिक सशक्तिकरण गर्नु हो।',
      content: `<p>दाङ जिल्लामा महिला उद्यमीहरूको नयाँ संगठन स्थापना भएको छ। 'दाङ महिला उद्यम संघ' नामक यस संगठनको उद्घाटन घोराहीमा सम्पन्न भयो।</p>

<h2>संगठनको उद्देश्य</h2>
<p>यस संगठनले महिला उद्यमीहरूलाई प्रशिक्षण, सहयोग र बजार पहुँच दिलाउने काम गर्नेछ। प्रारम्भिक चरणमा १५० जना महिला सदस्यहरू रहेका छन्।</p>

<h2>प्रशिक्षण कार्यक्रम</h2>
<p>संगठनले तत्काल महिलाहरूलाई सिलाइ, बुनाइ, खाद्य प्रशोधन र डिजिटल उद्यम सम्बन्धी प्रशिक्षण दिने कार्यक्रम सुरु गरेको छ।</p>

<p>संगठनकी अध्यक्षले भनिन्, "हाम्रो लक्ष्य दाङका महिलाहरूलाई आर्थिक रूपमा स्वावलम्बी बनाउनु हो।"</p>`,
      categoryId: societyCat?.id,
      author: 'KP Ghimire',
      status: 'published',
      featured: false,
      breaking: false,
      views: 198,
      publishedAt: new Date(now.getTime() - 72 * 60 * 60 * 1000),
    },
    {
      title: 'दाङको पर्यटन विकासमा नयाँ सम्भावना',
      slug: 'dang-ko-paryatan-bikasma-naya-sambhavana',
      summary: 'दाङमा पर्यटन विकासका नयाँ सम्भावनाहरू देखिएका छन्। बबई नदी किनारा र दाङ दुन उपत्यकाले पर्यटकहरूलाई आकर्षित गर्न सक्छ।',
      content: `<p>दाङ जिल्लाले पर्यटन क्षेत्रमा नयाँ उचाइ हासिल गर्ने सम्भावना देखिएको छ। जिल्लाको प्राकृतिक सौन्दर्य र सांस्कृतिक विरासतले आन्तरिक तथा बाह्य पर्यटकहरूलाई आकर्षित गर्न सक्छ।</p>

<h2>प्रमुख पर्यटकीय स्थलहरू</h2>
<p>दाङमा धेरै पर्यटकीय स्थलहरू छन् जसमध्ये बबई नदी, दाङ दुन उपत्यका, घोडाघोडी ताल र विभिन्न मन्दिरहरू प्रमुख छन्।</p>

<h2>पर्यटन पूर्वाधार</h2>
<p>पर्यटन पूर्वाधार विकासका लागि सरकारले थप लगानी गर्ने घोषणा गरेको छ। होटल, रेस्टुरेन्ट र यातायात सुविधाहरूमा सुधार गरिनेछ।</p>

<p>जिल्ला पर्यटन कार्यालयका प्रमुखले भने, "दाङको पर्यटन सम्भावना अपार छ। हामीले यसलाई सही ढंगले विकास गर्नु पर्छ।"</p>`,
      categoryId: dangCat?.id,
      author: 'KP Ghimire',
      status: 'published',
      featured: false,
      breaking: false,
      views: 142,
      publishedAt: new Date(now.getTime() - 96 * 60 * 60 * 1000),
    },
  ]

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: article,
    })
  }
  console.log(`✅ ${articles.length} sample articles created`)

  console.log('\n🎉 Database seeded successfully!')
  console.log('\nAdmin credentials:')
  console.log('  Username: admin')
  console.log('  Password: highway2024')
  console.log('\nAdmin panel: http://localhost:3000/admin')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
