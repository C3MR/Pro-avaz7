
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Users, Home, Building } from 'lucide-react'; // Assuming Twitter/X icon isn't directly in lucide, will use text or generic.

// Lucide doesn't have a direct X/Twitter icon, we'll use a simple text or a generic link icon if needed.
// For simplicity, direct text link for X will be used.

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '/', label: 'الرئيسية', icon: <Home size={16} /> },
    { href: '/our-properties', label: 'عقاراتنا', icon: <Building size={16} /> },
    { href: '/about-us', label: 'من نحن', icon: <Users size={16} /> },
    { href: '/contact-us', label: 'تواصل معنا', icon: <Mail size={16} /> },
  ];

  const addressLine1 = "2225 طريق الملك عبدالعزيز، حي الياسمين،";
  const addressLine2 = "7443، الرياض 13326، المملكة العربية السعودية";
  const phoneNumber = "920004209";
  const emailAddress = "info@avaz.sa";
  const twitterHandle = "@avaz_sa";
  const twitterUrl = "https://x.com/avaz_sa";


  return (
    <footer className="bg-gray-900 border-t border-gray-700 py-10 text-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Column 1: Logo and About */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image 
                src="https://avaz.sa/tower/images/logo-avaz.png" 
                alt="AVAZ Logo" 
                width={150} 
                height={41} 
                className="h-auto"
                data-ai-hint="company logo"
              />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              شركة رائدة في مجال الخدمات العقارية المتكاملة بالمملكة العربية السعودية، نسعى لتقديم حلول عقارية مبتكرة تلبي تطلعات عملائنا.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-300 hover:text-primary transition-colors flex items-center gap-2">
                    {link.icon}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">تواصل معنا</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                <span className="text-gray-400">{addressLine1}<br/>{addressLine2}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-gray-400 shrink-0" />
                <a href={`tel:${phoneNumber.replace(/\s/g, '')}`} className="text-gray-300 hover:text-primary transition-colors" dir="ltr">{phoneNumber}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-gray-400 shrink-0" />
                <a href={`mailto:${emailAddress}`} className="text-gray-300 hover:text-primary transition-colors">{emailAddress}</a>
              </li>
               <li className="flex items-center gap-2">
                {/* Using a simple text 'X' or a generic link icon could be an option here */}
                {/* For now, let's use a generic approach or just text */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-twitter-x text-gray-400 shrink-0" viewBox="0 0 16 16">
                    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
                </svg>
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition-colors">{twitterHandle}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} AVAZ العقارية. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
