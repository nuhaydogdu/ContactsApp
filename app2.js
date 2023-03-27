class Kisi {
    constructor(ad, soyad, mail) {
        this.ad = ad;
        this.soyad = soyad;
        this.mail = mail;
    }
}

class Util {                                                            //2//Util yararlı fonksiyonları içeren ayrı bir sınıf tanımlaması
    static bosAlanlariKontrolEt(...alanlar) {                           ////Static yaptığımızda new vs demeye gerek yok direk sınıf ismiyle ulaşabiliyoruz Util.bosAlanlariKontrolEt
        //kaç değer yollayacağımızı bilmiyorsak ...sprite operator  kullanbiliriz(...ücNokta)
        let sonuc = true;
        alanlar.forEach(alan => {
            if (alan.length === 0) {
                sonuc = false;
                return false;
            }
        });
        return sonuc;
    }

    static emailGecerliMi(email) {          //11//email kontrolünü sağlamak için stackoverflow
        const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return re.test(String(email).toLowerCase());
    }
}

class Ekran {
    constructor() {
        this.ad = document.getElementById("ad");
        this.soyad = document.getElementById("soyad");
        this.mail = document.getElementById("mail");
        this.form = document.getElementById('form-rehber');
        this.form.addEventListener("submit", this.kaydetGuncelle.bind(this));                     //bind(this)//kaydetGuncelle içerisinde this kullanılacak olursa ekranı göstersin ekranın içindeki tanımlı olan değerleri kullanabilmesi için (form u değil)!
        this.kisiListesi = document.querySelector(".kisi-listesi");
        this.ekleGuncelleButon = document.querySelector(".kaydetGuncelle");
        this.kisiListesi.addEventListener("click", this.guncelleVeyaSil.bind(this));              //7//lisiListesi tbody değilde ekrana ulaşmak için -bind
        // local storagge islemeri için kullanılır
        this.depo = new Depo();                                                                   //burada ekranımızı depoyla ilişkilendirdik

        this.secilenSatir = undefined;                                                            // uptade ve delete butonlarına basıldığnda ilgili tr elemanı burada tutulur 

        this.kisileriEkranaYazdir();                                                              ////localStorage den ekrana yazdırma
    }

    alanlariTemizle() {                                                  //9//
        this.ad.value = "";
        this.soyad.value = "";
        this.mail.value = "";
    }

    guncelleVeyaSil(e) {                                                 //7//
        const tiklanmaYeri = e.target;
        if (tiklanmaYeri.classList.contains("btn--delete")) {
            this.secilenSatir = tiklanmaYeri.parentElement.parentElement;
            this.kisiyiEkrandanSil();
        } else if (tiklanmaYeri.classList.contains("btn--edit")) {
            this.secilenSatir = tiklanmaYeri.parentElement.parentElement;
            this.ekleGuncelleButon.value = 'guncelle';
            this.ad.value = this.secilenSatir.cells[0].textContent;
            this.soyad.value = this.secilenSatir.cells[1].textContent;
            this.mail.value = this.secilenSatir.cells[2].textContent;
        }
    }

    kisiyiEkrandaGuncelle(kisi) {                                        //9//

        const sonuc = this.depo.kisiGuncelle(kisi, this.secilenSatir.cells[2].textContent);  ////eski maili kullanabilmek için güncellemeden önce yazdık

        if (sonuc) {
            this.secilenSatir.cells[0].textContent = kisi.ad;
            this.secilenSatir.cells[1].textContent = kisi.soyad;
            this.secilenSatir.cells[2].textContent = kisi.mail;


            this.alanlariTemizle();
            this.secilenSatir = undefined;
            this.ekleGuncelleButon.value = 'kaydet';
            this.bilgiOlustur('Kişi güncellendi', true);

        } else {

            this.bilgiOlustur('Yazdığınız mail kullnımda', false);
        }

    }

    kisiyiEkrandanSil() {                                                //8//
        this.secilenSatir.remove();
        const silinecekMail = this.secilenSatir.cells[2].textContent;

        this.depo.kisiyiSil(silinecekMail);
        this.alanlariTemizle();
        this.secilenSatir = undefined;
        this.bilgiOlustur('Kişi rehberden silindi', true)
    }

    bilgiOlustur(mesaj, durum) {                                        //10//

        const uyariDivi = document.querySelector('.bilgi')

        uyariDivi.innerHTML = mesaj;

        uyariDivi.classList.add(durum ? 'bilgi--success' : 'bilgi--error');

        // setTimeout:örnk iki saniyede sonra kodu çalıştır, setInteval: her iki saniyede bir  kodu çalışatıtır.
        setTimeout(function () {
            uyariDivi.className = 'bilgi';
        }, 2000);
    }

    kisileriEkranaYazdir() {                                            //4//ekran yüklenir yüklenmez constructor tetiklenecek ve oradan da this.kisileriEkranaYazdir(); çalıştırılacak.
        this.depo.tumKisiler.forEach(kisi => {                          //arrow function kullanmasaydık this le alakalı sorun yaşanabilirmiş.
            this.kisiyiEkranaEkle(kisi);
        })
    }

    kisiyiEkranaEkle(kisi) {                                            //3//
        const olusturulanTr = document.createElement('tr');
        olusturulanTr.innerHTML = `
        <td> ${kisi.ad}</td>
        <td> ${kisi.soyad}</td>
        <td> ${kisi.mail}</td>
        <td>
            <button class="btn btn--edit"> <i class="far fa-edit"></i> </button> 
            <button class="btn btn--delete"> <i class="far fa-trash-alt"></i> </button>    
        </td>`;

        this.kisiListesi.appendChild(olusturulanTr);
    }

    kaydetGuncelle(e) {                                                 //1//ekran constructure sindeki değerleri burada çağırıp Kisi sınıfından  oluşturduğumuza atıyoruz sonradan aşağıda da kullnaıyor
        e.preventDefault();
        const kisi = new Kisi(this.ad.value, this.soyad.value, this.mail.value);
        const sonuc = Util.bosAlanlariKontrolEt(kisi.ad, kisi.soyad, kisi.mail);
        const emailGecerliMi = Util.emailGecerliMi(this.mail.value);
        console.log(this.mail.value + " için e mail kontrol sonuç: " + emailGecerliMi);


        // tüm alnlar doldurulmuşsa true doldurulmamaışsa false
        if (sonuc) {

            if (!emailGecerliMi) {
                this.bilgiOlustur('Geçerli bir mail giriniz', false)
                return;                                                      //return yapınca kaydetGüncelle fonksiyonundan çıkıyor
            }

            if (this.secilenSatir) {
                //secilenSatir undefined değilse güncellenecek demektir 
                this.kisiyiEkrandaGuncelle(kisi);

            } else {

                //local storage ekle
                const sonuc = this.depo.kisiEkle(kisi);
                console.log("sonuc : " + sonuc + " kaydetgüncelle içinde")

                if (sonuc) {
                    this.bilgiOlustur('Başarıyla eklendi', true);
                    // yeni kisiyi ekrana ekler
                    this.kisiyiEkranaEkle(kisi);
                    this.alanlariTemizle();
                } else {
                    this.bilgiOlustur('Bu mail kullanımda', false)

                }

            }
        } else {
            this.bilgiOlustur('Boş alanları doldurunuz', false)
        }
    }
}


class Depo {

    // UYGULAMA İLK AÇILDIPINDA VERİLER GETİRİLİR 
    constructor() {
        this.tumKisiler = this.kisileriGetir();
    }

    emailEssizMi(mail) {
        const sonuc = this.tumKisiler.find(kisi => {
            return kisi.mail === mail;
        })
        //demekki b maili kullanan biri var
        if (sonuc) {
            console.log(mail + "kullanımda")
            return false;
        } else {
            console.log(mail + "kullanımda değil ekle güncelle yapabilirsiniz")
            return true;
        }
    }

    kisileriGetir() {                                                           //0.1
        let tumKisilerLocal;
        if (localStorage.getItem("tumKisiler") === null) {
            tumKisilerLocal = [];
        } else {
            tumKisilerLocal = JSON.parse(localStorage.getItem("tumKisiler"));
        };
        return tumKisilerLocal;
    }

    kisiEkle(kisi) {                                                            //0.2

        if (this.emailEssizMi(kisi.mail)) {
            this.tumKisiler.push(kisi);
            localStorage.setItem("tumKisiler", JSON.stringify(this.tumKisiler));
            return true;
        } else {
            return false;
        }

    }

    kisiyiSil(mail) {                                                           //5//
        this.tumKisiler.forEach((kisi, index) => {

            if (kisi.mail.trim() === mail.trim()) {                             //trim ne??
                this.tumKisiler.splice(index, 1)
            }
        });
        localStorage.setItem("tumKisiler", JSON.stringify(this.tumKisiler));
    }

    //gücellenmisKisi :  yeni değğerleri  içerir
    //mail kişinin veritabanına bulunması gerekli olan eski mailini içerir. 
    kisiGuncelle(guncellenmisKisi, mail) {                                     //6//

        if (guncellenmisKisi === mail) {                                          //kişi sadece ad ve soyadını güncelliyor mail sei mail olarak kalacak
            this.tumKisiler.forEach((kisi, index) => {
                if (kisi.mail === mail) {
                    console.log('kişi döngüde bulundu');
                    this.tumKisiler[index] = guncellenmisKisi;
                    localStorage.setItem("tumKisiler", JSON.stringify(this.tumKisiler));
                    return true;
                }
            });

            return true;
        }

        if (this.emailEssizMi(guncellenmisKisi.mail)) {
            console.log(guncellenmisKisi.mail + " için kontrol yapılıyor sonuç: güncelleme yapabilirsin")

            this.tumKisiler.forEach((kisi, index) => {
                if (kisi.mail === mail) {                                      //sorun burada
                    console.log('kişi döngüde bulundu');
                    this.tumKisiler[index] = guncellenmisKisi;
                    localStorage.setItem("tumKisiler", JSON.stringify(this.tumKisiler));
                    return true;
                }
            });

            return true;


        } else {
            console.log(guncellenmisKisi.mail + " mail kullanımda güncelleme yapılamaz ")
            return false;
        }

    }
}


document.addEventListener("DOMContentLoaded", function (e) {                          ////ilk defa ekran oluşturulduğunda yani uygulama ilk açıldığında constructorumuz tetikleniyor
    const ekran = new Ekran();
});

