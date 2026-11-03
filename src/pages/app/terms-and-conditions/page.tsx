import { Box, Button, Paper, Typography } from "@mui/material";
import LogoVertical from "@/components/logo/logo-vertical";
import Header from "@/components/layout/containers/header";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { Check } from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

export default function Page() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isTurkish = i18n.resolvedLanguage?.toLowerCase().startsWith("tr") ?? false;

  return (
    <>
      <OverlayScrollbarsComponent defer className='h-dvh os-scrollbar-body'>
        <Header minimal />
        <Box className='bg-background flex min-h-[calc(100vh-3.5rem)] w-full items-center justify-center bg-cover bg-fixed bg-center p-4'>
          <Paper elevation={3} className='bg-background-paper shadow-darker-xs w-2xl max-w-full rounded-4xl py-10'>
            <Box className='flex flex-col gap-4 px-10'>
              <Box className='flex flex-col'>
                <Box className='mb-14 flex justify-center'>
                  <LogoVertical />
                </Box>

                <Box className='flex flex-col gap-10'>
                  <Box className='flex flex-col'>
                    <Typography variant='h3' component='h1' className='mb-2'>
                      {isTurkish ? "Kullanım Koşulları" : "Terms and Conditions"}
                    </Typography>
                    <Typography variant='body1' className='text-text-primary'>
                      {isTurkish
                        ? "Bu kullanım koşulları, AKDI MAKINE uygulamasının kullanımına ilişkin kural ve şartları düzenler. Uygulamaya erişerek bu koşulları kabul etmiş sayılırsınız. Bu sayfada belirtilen koşulların tamamını kabul etmiyorsanız AKDI MAKINE uygulamasını kullanmaya devam etmeyin."
                        : "These terms and conditions outline the rules and regulations for the use of AKDI MAKINE application. By accessing this page we assume you accept these terms and conditions. Do not continue to use AKDI MAKINE if you do not agree to all of the terms and conditions stated on this page."}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant='h6' className='mb-2'>
                      {isTurkish ? "1. Koşulların Kabulü" : "1. Acceptance of Terms"}
                    </Typography>
                    <Typography variant='body1'>
                      {isTurkish
                        ? "AKDI MAKINE uygulamasını (\"Uygulama\") indirerek, yükleyerek veya kullanarak bu Kullanım Koşulları'na bağlı olmayı kabul edersiniz. Kabul etmiyorsanız Uygulama'yı kullanmamalısınız."
                        : "By downloading, installing, or using AKDI MAKINE (“Application”), you agree to be bound by these Terms and Conditions. If you do not agree, you must not use the Application."}
                    </Typography>
                    <br />

                    <Typography variant='h6' className='mb-2'>
                      {isTurkish ? "2. Kullanım Amacı" : "2. Intended Use"}
                    </Typography>
                    <ul className='list-disc [&>li]:ms-4 [&>li:first-of-type]:mt-1'>
                      <li>{isTurkish ? "Uygulama yalnızca AKDI MAKINE makineleriyle kullanılmak üzere tasarlanmıştır." : "The Application is designed exclusively for use with AKDI MAKINE machines."}</li>
                      <li>{isTurkish ? "Uygulama tek başına veya uyumlu olmayan ekipmanlarla kullanılmamalıdır." : "The Application must not be used independently or with non-compatible equipment."}</li>
                      <li>{isTurkish ? "Uygulamanın amacı dışında her türlü kullanımı kesinlikle yasaktır." : "Any misuse outside of its intended purpose is strictly prohibited."}</li>
                    </ul>
                    <br />

                    <Typography variant='h6' className='mb-2'>
                      {isTurkish ? "3. Kullanıcının Sorumlulukları" : "3. User Responsibilities"}
                    </Typography>
                    <ul className='list-disc [&>li]:ms-4 [&>li:first-of-type]:mt-1'>
                      <li>
                        {isTurkish
                          ? "Kullanıcılar, AKDI MAKINE tarafından sağlanan tüm kullanım talimatlarına uymalıdır. Talimatlar sağlanmamışsa bu talimatları talep etmekle yükümlüdürler."
                          : "Users must follow all operating instructions provided by AKDI MAKINE, or are obligated to request such instructions if they have not been provided."}
                      </li>
                      <li>{isTurkish ? "Makinenin ve Uygulama'nın yürürlükteki güvenlik standartlarına uygun şekilde çalıştırılmasını sağlamak kullanıcıların sorumluluğundadır." : "Users are responsible for ensuring that the machine and Application are operated in compliance with applicable safety standards."}</li>
                      <li>{isTurkish ? "Uygulama yalnızca makineyi kullanmaya yetkili, eğitimli personel tarafından kullanılmalıdır." : "The Application should only be used by trained personnel authorized to operate the machine."}</li>
                    </ul>
                    <br />

                    <Typography variant='h6' className='mb-2'>
                      {isTurkish ? "4. Güvenlik Önlemleri" : "4. Safety Measures"}
                    </Typography>
                    <ul className='list-disc [&>li]:ms-4 [&>li:first-of-type]:mt-1'>
                      <li>{isTurkish ? "Makinenin kullanım kılavuzunda yer alan güvenlik talimatlarına daima uyun; kılavuz sağlanmamışsa bu talimatları AKDI MAKINE'den isteyin." : "Always adhere to the safety guidelines outlined in the machine’s user manual, or request them from AKDI MAKINE if not supplied."}</li>
                      <li>{isTurkish ? "Güvenlik özelliklerini devre dışı bırakmayın veya atlatmayın." : "Do not bypass or disable safety features."}</li>
                      <li>{isTurkish ? "Çalışma sırasında uygun kişisel koruyucu donanım kullanıldığından emin olun." : "Ensure proper protective equipment is worn during operation."}</li>
                      <li>{isTurkish ? "Güvenlik talimatlarına uyulmamasından veya bu talimatların talep edilmemesinden kaynaklanan yaralanma ya da zararlardan AKDI MAKINE sorumlu tutulamaz." : "AKDI MAKINE is not liable for injuries or damages resulting from failure to follow or request safety instructions."}</li>
                    </ul>
                    <br />

                    <Typography variant='h6' className='mb-2'>
                      {isTurkish ? "5. Güncellemeler ve Değişiklikler" : "5. Updates and Modifications"}
                    </Typography>
                    <ul className='list-disc [&>li]:ms-4 [&>li:first-of-type]:mt-1'>
                      <li>{isTurkish ? "AKDI MAKINE, işlevselliği veya güvenliği iyileştirmek amacıyla Uygulama'yı dilediği zaman güncelleyebilir ya da değiştirebilir." : "AKDI MAKINE may update or modify the Application at any time to improve functionality or security."}</li>
                      <li>{isTurkish ? "Güncellemelerden sonra Uygulama'yı kullanmaya devam etmeniz, güncellenmiş Koşulları kabul ettiğiniz anlamına gelir." : "Continued use of the Application after updates constitutes acceptance of the revised Terms."}</li>
                    </ul>
                    <br />

                    <Typography variant='h6' className='mb-2'>
                      {isTurkish ? "6. Sorumluluğun Sınırlandırılması" : "6. Limitation of Liability"}
                    </Typography>
                    <ul className='list-disc [&>li]:ms-4 [&>li:first-of-type]:mt-1'>
                      <li>{isTurkish ? "Uygulama, herhangi bir garanti verilmeksizin mevcut hâliyle sunulur." : "The Application is provided “as is” without warranties of any kind."}</li>
                      <li>{isTurkish ? "Uygulama'nın veya makinenin hatalı kullanımından doğan zarar, kayıp ya da yaralanmalardan AKDI MAKINE sorumlu tutulamaz." : "AKDI MAKINE shall not be held liable for damages, losses, or injuries arising from improper use of the Application or machine."}</li>
                      <li>{isTurkish ? "Güvenlik ve kullanım gerekliliklerine uyma sorumluluğu tamamen kullanıcılara aittir." : "Users assume full responsibility for compliance with safety and operational requirements."}</li>
                    </ul>
                    <br />

                    <Typography variant='h6' className='mb-2'>
                      {isTurkish ? "7. Fikri Mülkiyet" : "7. Intellectual Property"}
                    </Typography>
                    <ul className='list-disc [&>li]:ms-4 [&>li:first-of-type]:mt-1'>
                      <li>{isTurkish ? "Uygulama ve içeriği AKDI MAKINE'nin mülkiyetindedir." : "The Application and its content are the property of AKDI MAKINE."}</li>
                      <li>{isTurkish ? "Yetkisiz çoğaltma, dağıtım veya değişiklik yapılması yasaktır." : "Unauthorized reproduction, distribution, or modification is prohibited."}</li>
                    </ul>
                    <br />

                    <Typography variant='h6' className='mb-2'>
                      {isTurkish ? "8. Fesih" : "8. Termination"}
                    </Typography>
                    <ul className='list-disc [&>li]:ms-4 [&>li:first-of-type]:mt-1'>
                      <li>{isTurkish ? "AKDI MAKINE, bu Koşulların ihlal edilmesi hâlinde Uygulama'ya erişimi askıya alma veya sonlandırma hakkını saklı tutar." : "AKDI MAKINE reserves the right to suspend or terminate access to the Application if these Terms are violated."}</li>
                    </ul>
                    <br />

                    <Typography variant='h6' className='mb-2'>
                      {isTurkish ? "9. Uygulanacak Hukuk" : "9. Governing Law"}
                    </Typography>
                    <ul className='list-disc [&>li]:ms-4 [&>li:first-of-type]:mt-1'>
                      <li>
                        {isTurkish
                          ? "Bu Koşullar, Türkiye Cumhuriyeti kanunlarına tabi olacak ve bu kanunlara göre yorumlanacaktır. Bu Koşullardan doğan veya bunlarla bağlantılı her türlü uyuşmazlıkta Türkiye'deki mahkemeler münhasır yetkilidir."
                          : "These Terms shall be governed by and construed in accordance with the laws of the Republic of Türkiye. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in Türkiye."}
                      </li>
                    </ul>
                    <br />

                    <Typography variant='h6' className='mb-2'>
                      {isTurkish ? "10. Kullanıcının Beyanı" : "10. User Acknowledgment"}
                    </Typography>
                    <Typography variant='body1'>
                      {isTurkish ? "AKDI MAKINE'yi kullanarak aşağıdakileri kabul ve beyan etmiş olursunuz:" : "By using AKDI MAKINE, you acknowledge and confirm that:"}
                    </Typography>
                    <ul className='list-disc [&>li]:ms-4 [&>li:first-of-type]:mt-1'>
                      <li>
                        {isTurkish
                          ? "AKDI MAKINE'den gerekli kullanım ve güvenlik talimatlarını aldığınızı veya başlangıçta sağlanmadıysa bu talimatları talep ettiğinizi;"
                          : "You have received the necessary operating and safety instructions from AKDI MAKINE, or you have requested them if they were not initially provided."}
                      </li>
                      <li>
                        {isTurkish
                          ? "Uygulama'yı ve makineyi bu talimatlara ve güvenlik önlemlerine uygun şekilde kullanma sorumluluğunuzu anladığınızı ve kabul ettiğinizi;"
                          : "You understand and accept your responsibility to operate the Application and machine in accordance with these instructions and safety measures."}
                      </li>
                      <li>
                        {isTurkish
                          ? "Talimatları almamanın veya bunlara uymamanın bu Koşullar kapsamındaki sorumluluğunuzu ortadan kaldırmadığını kabul ettiğinizi."
                          : "You agree that failure to obtain or follow instructions does not exempt you from liability or responsibility under these Terms."}
                      </li>
                    </ul>
                  </Box>

                  <Button variant='pastel' color='grey' startIcon={<Check size={16} />} onClick={() => navigate(-1)}>
                    {isTurkish ? "Devam Et" : "Continue"}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      </OverlayScrollbarsComponent>
    </>
  );
}
