import { Metadata } from 'next'
import Link from 'next/link'
import {
  Radio,
  Newspaper,
  Award,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Mic,
  BookOpen,
  Users,
  TrendingUp,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'About KP Ghimire | Highway Express',
  description:
    'Learn about KP Ghimire - Managing Director of Radio Highway FM and founder of Highway Express news portal in Dang, Nepal.',
}

const timelineItems = [
  {
    year: '2024',
    title: 'Highway Express Digital News Portal',
    titleNepali: 'हाइवे एक्सप्रेस डिजिटल समाचार पोर्टल',
    description:
      'Founded and launched Highway Express, a digital news portal serving Dang district and beyond with reliable, timely journalism.',
    icon: Newspaper,
    color: 'bg-blue-600',
  },
  {
    year: '2015',
    title: 'Managing Director – Radio Highway FM',
    titleNepali: 'व्यवस्थापन निर्देशक – रेडियो हाइवे एफएम',
    description:
      'Appointed as Managing Director of Radio Highway FM, leading the station to become one of the most listened-to community radio stations in Dang district.',
    icon: Radio,
    color: 'bg-red-600',
  },
  {
    year: '2010',
    title: 'Senior Journalist & News Editor',
    titleNepali: 'वरिष्ठ पत्रकार र समाचार सम्पादक',
    description:
      'Worked as a senior journalist and news editor, covering local politics, development, and social issues in the Rapti zone.',
    icon: Mic,
    color: 'bg-orange-500',
  },
  {
    year: '2005',
    title: 'Career in Journalism Begins',
    titleNepali: 'पत्रकारिता करियरको सुरुवात',
    description:
      'Started journalistic career with a focus on community reporting, bringing the voices of local communities to the forefront of Nepali media.',
    icon: BookOpen,
    color: 'bg-green-600',
  },
]

const skills = [
  { label: 'Broadcast Journalism', level: 95 },
  { label: 'Digital Media Management', level: 90 },
  { label: 'Community Reporting', level: 95 },
  { label: 'News Editing & Writing', level: 92 },
  { label: 'Radio Production', level: 90 },
  { label: 'Public Affairs & Politics', level: 85 },
]

const achievements = [
  {
    icon: Radio,
    title: 'Radio Highway FM',
    description:
      'Led Radio Highway FM as Managing Director, growing it into a trusted voice for the Dang community.',
  },
  {
    icon: Users,
    title: 'Community Advocacy',
    description:
      'Championed the causes of marginalized communities through investigative and community journalism.',
  },
  {
    icon: TrendingUp,
    title: 'Digital Transformation',
    description:
      'Pioneered digital journalism in Dang by launching Highway Express online news portal.',
  },
  {
    icon: Award,
    title: 'Recognition',
    description:
      'Recognized by journalism associations for contributions to media development in Lumbini Province.',
  },
]

export default function AboutPage() {
  return (
    <div className="bg-gray-50">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <nav className="flex items-center gap-1 text-sm text-gray-500">
          <Link href="/" className="hover:text-red-700 transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <span className="text-gray-700">About</span>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-800 via-red-700 to-blue-900 text-white py-16 mt-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-5 border-4 border-white/40 shadow-xl">
            <span className="text-5xl font-bold text-white">KP</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">KP Ghimire</h1>
          <p className="text-xl text-red-100 mb-1">केपी घिमिरे</p>
          <p className="text-lg text-white/80 mb-4">
            Managing Director, Radio Highway FM &amp; Founder, Highway Express
          </p>
          <p className="text-white/70 text-sm">
            Dang, Lumbini Province, Nepal
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/30">
              20+ Years in Journalism
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/30">
              Radio &amp; Digital Media
            </span>
          </div>
        </div>
      </section>

      {/* Biography Section */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* English Bio */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen size={22} className="text-red-700" /> Biography
            </h2>
            <div className="prose text-gray-700 space-y-4">
              <p>
                KP Ghimire is a veteran journalist and media personality from Dang
                district in Lumbini Province, Nepal. With over two decades of
                experience in broadcast and digital journalism, he has dedicated
                his career to bringing accurate, timely, and impactful news to
                the people of Dang and beyond.
              </p>
              <p>
                As the Managing Director of Radio Highway FM, KP Ghimire has
                transformed the station into one of the most influential community
                radio platforms in the region. Under his leadership, Radio Highway
                FM has become a trusted source of local news, entertainment, and
                public information for hundreds of thousands of listeners.
              </p>
              <p>
                In 2024, he founded Highway Express, a digital news portal aimed
                at modernizing news delivery in Dang and making reliable journalism
                accessible to a wider online audience. Highway Express covers local,
                national, and international news with a special focus on stories
                that matter to the communities of Dang and Lumbini Province.
              </p>
              <p>
                KP Ghimire is a strong advocate for press freedom, community
                journalism, and the use of technology to bridge the information
                gap in rural Nepal.
              </p>
            </div>
          </div>

          {/* Nepali Bio */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen size={22} className="text-red-700" /> जीवनी
            </h2>
            <div className="prose text-gray-700 space-y-4">
              <p>
                केपी घिमिरे नेपालको लुम्बिनी प्रदेशअन्तर्गत दाङ जिल्लाका एक
                अनुभवी पत्रकार र सञ्चारमाध्यम व्यक्तित्व हुन्। प्रसारण र
                डिजिटल पत्रकारितामा दुई दशकभन्दा बढी अनुभवसहित, उनले आफ्नो
                करियर दाङ र यसभन्दा पर बस्ने मानिसहरूलाई सटीक, समयमै र
                प्रभावशाली समाचार पुर्‍याउन समर्पित गरेका छन्।
              </p>
              <p>
                रेडियो हाइवे एफएमका व्यवस्थापन निर्देशकको रूपमा, केपी घिमिरेले
                स्टेसनलाई क्षेत्रका सबैभन्दा प्रभावशाली सामुदायिक रेडियो
                प्लेटफर्महरूमध्ये एकमा रूपान्तरण गरेका छन्।
              </p>
              <p>
                २०२४ मा उनले हाइवे एक्सप्रेस स्थापना गरे — एक डिजिटल समाचार
                पोर्टल जसले दाङमा समाचार वितरणलाई आधुनिक बनाउने र विश्वसनीय
                पत्रकारिताको व्यापक अनलाइन दर्शकमा पहुँच पुर्‍याउने लक्ष्य
                राखेको छ।
              </p>
              <p>
                केपी घिमिरे पत्रकारिता स्वतन्त्रता, सामुदायिक पत्रकारिता र
                ग्रामीण नेपालमा सूचना अन्तर पाट्नका लागि प्रविधिको प्रयोगका
                बलिया पक्षधर हुन्।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Career Timeline */}
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">
            Career Timeline
          </h2>
          <div className="relative">
            {/* Center line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2" />
            <div className="space-y-10">
              {timelineItems.map((item, idx) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.year}
                    className={`flex flex-col md:flex-row gap-6 md:gap-0 ${
                      idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    <div
                      className={`md:w-1/2 ${
                        idx % 2 === 0
                          ? 'md:pr-10 md:text-right'
                          : 'md:pl-10 md:text-left'
                      }`}
                    >
                      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 inline-block w-full">
                        <span className="text-red-700 font-bold text-lg">{item.year}</span>
                        <h3 className="text-base font-bold text-gray-900 mt-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {item.titleNepali}
                        </p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>

                    {/* Center icon */}
                    <div className="hidden md:flex items-start justify-center w-0 relative">
                      <div
                        className={`absolute top-5 -translate-x-1/2 w-10 h-10 rounded-full ${item.color} flex items-center justify-center shadow-md z-10`}
                      >
                        <Icon size={18} className="text-white" />
                      </div>
                    </div>

                    <div className="md:w-1/2" />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Skills &amp; Expertise
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {skills.map((skill) => (
            <div key={skill.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  {skill.label}
                </span>
                <span className="text-sm text-red-700 font-bold">{skill.level}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-red-700 to-red-500 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section className="bg-gradient-to-br from-gray-900 to-red-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-10 text-center">
            Key Achievements
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-colors"
                >
                  <Icon size={28} className="text-yellow-400 mb-3" />
                  <h3 className="font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/70 text-sm">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact</h2>
          <p className="text-gray-500 mb-6">
            Get in touch with KP Ghimire or the Highway Express team.
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 text-gray-700">
              <MapPin size={18} className="text-red-700 flex-shrink-0" />
              <span>Ghorahi, Dang, Lumbini Province, Nepal</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-gray-700">
              <Phone size={18} className="text-red-700 flex-shrink-0" />
              <a href="tel:+977" className="hover:text-red-700 transition-colors">
                +977 (Dang Office)
              </a>
            </div>
            <div className="flex items-center justify-center gap-3 text-gray-700">
              <Mail size={18} className="text-red-700 flex-shrink-0" />
              <a
                href="mailto:info@highwayexpress.com.np"
                className="hover:text-red-700 transition-colors"
              >
                info@highwayexpress.com.np
              </a>
            </div>
          </div>
          <Link
            href="/news"
            className="inline-block mt-8 bg-red-700 hover:bg-red-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Read Our News
          </Link>
        </div>
      </section>
    </div>
  )
}
