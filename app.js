//arayüz elemanları seçim işlemi
const ad = document.querySelector('#ad');
const soyad = document.querySelector('#soyad');
const mail = document.querySelector('#mail');

const form = document.querySelector('#form-rehber');
const kisiListesi = document.querySelector('.kisi-listesi');

// Event listenerlerin tanımlanması
form.addEventListener('submit', kaydet);
kisiListesi.addEventListener('click', kisiIslemleriniYap);

//tüm kişiler için dizi
const tumKisilerDizisi = [];
let secilenSatir = undefined;                                //güncellemeyi bu değişken üzerinden kontrol ediyoruz unddefined ise çalışma değer varsa çalış

function kisiIslemleriniYap(e) {
    if (e.target.classList.contains('btn--delete')) {
        const silinecekTr = e.target.parentElement.parentElement;
        const silinecekMail = e.target.parentElement.previousElementSibling.textContent;

        rehberdenSil(silinecekTr, silinecekMail);

    } else if (e.target.classList.contains('btn--edit')) {
        document.querySelector('.kaydetGuncelle').value = "Güncelle";
        const secilenTr = e.target.parentElement.parentElement;
        const guncellenecekMail = secilenTr.cells[2].textContent;   //table de cells[i] yapısını kullnambiliriz

        ad.value = secilenTr.cells[0].textContent;
        soyad.value = secilenTr.cells[1].textContent;
        mail.value = secilenTr.cells[2].textContent;

        secilenSatir = secilenTr;                                       //güncelleme yapılan satırı atayarak işlec kazanmasını sağlıyoruz
    }
}

function rehberdenSil(silinecekTr, silinecekMail) {
    silinecekTr.remove();

    //maile göre silme işlemi
    //foreach ile
    tumKisilerDizisi.forEach((kisi, index) => {
        if (kisi.mail === silinecekMail) {
            tumKisilerDizisi.splice(index, 1);
        }

    });

    alanlariTemizle();
    document.querySelector('.kaydetGuncelle').value='kaydet';

    //filter ile
    //     const silinmeyecekKisiler=tumKisilerDizisi.filter(function(kisi, index){
    // return kisi.mail !== silinecekMail;
    //     });
    //     tumKisilerDizisi.length=0;
    //     tumKisilerDizisi.push(...silinmeyecekKisiler);                 //burada baştaki ...ile dizinin elemeanlarıını attık, koymasak direk dizinin içerisine diziyi atacaktı 

    // console.log("silme yapıldı son durum")
    // console.log(tumKisilerDizisi);
}

function kaydet(e) {
    e.preventDefault()

    const eklenecekVeyaGuncellenecekKisi = {
        ad: ad.value,
        soyad: soyad.value,
        mail: mail.value
    }
    const sonuc = verileriKontrolEt(eklenecekVeyaGuncellenecekKisi);
    if (sonuc.durum) {
        if (secilenSatir) {                                                // secilenSatir undifined değilse güncellme yap
            kisiyiGuncelle(eklenecekVeyaGuncellenecekKisi);
        } else {
            kisiyiEkle(eklenecekVeyaGuncellenecekKisi);
        }
    } else {
        bilgiOlustur(sonuc.mesaj, sonuc.durum);
    }
}

function verileriKontrolEt(kisi) {
    for (const deger in kisi) {                                //arraylerde(let i for dizi) gibi objelerde de -in- şeklinde kullanılıyor.
        if (kisi[deger]) {                                     //içerisinde herhangi bir değer olduğunda true dönecek
            // console.log(kisi[deger]);                       //direkt dege yazınca keyleri veriyor -kisi[deger] kişinin içerisindeki degerleri yazdırdık
        } else {
            const sonuc = {
                durum: false,
                mesaj: 'Boş Alan Bırakmayınız'
            }
            return sonuc;                                     //iki return de aynı birini uzun yoldan birini kısa yoldan yaptık
        }
    }

    alanlariTemizle();
    return {
        durum: true,
        mesaj: 'Bilgiler Kaydedildi'
    }

}


function kisiyiGuncelle(kisi) {
    //kisi paremetresinde seçilen kişinin yeni değerleri vardır
    //secilenSatırda da eski değerler var 
    for (let i = 0; i < tumKisilerDizisi.length; i++) {
        if (tumKisilerDizisi[i].mail === secilenSatir.cells[2].textContent) {
            tumKisilerDizisi[i] = kisi;
            break;
        }
    }

    secilenSatir.cells[0].textContent = kisi.ad;
    secilenSatir.cells[1].textContent = kisi.soyad;
    secilenSatir.cells[2].textContent = kisi.mail;

    document.querySelector('.kaydetGuncelle').value = 'kaydet';
    secilenSatir = undefined;

    console.log(tumKisilerDizisi);
}

function kisiyiEkle(eklenecekKisi) {

    const olusturulanTrElementi = document.createElement('tr');
    olusturulanTrElementi.innerHTML = `<td>${eklenecekKisi.ad}</td>
    <td>${eklenecekKisi.soyad}</td>
    <td>${eklenecekKisi.mail}</td>
    <td>
        <button class="btn btn--edit"><i class="far fa-edit"></i></button>
        <button class="btn btn--delete"><i class="far fa-trash-alt"></i></button>  
    </td>`;

    kisiListesi.appendChild(olusturulanTrElementi);

    tumKisilerDizisi.push(eklenecekKisi);
    console.log(tumKisilerDizisi);

    bilgiOlustur("Kişi rehbere kaydedildi", true);

}

function bilgiOlustur(mesaj, durum) {
    const olusturulanBilgi = document.createElement('div');
    olusturulanBilgi.textContent = mesaj;
    olusturulanBilgi.className = 'bilgi';
    if (durum) {
        olusturulanBilgi.classList.add('bilgi--success');                                       //üstte ki class name olara eklediğimiz sınıfı ezmemesi için classList ile ekleme yaptık 
    } else {
        olusturulanBilgi.classList.add('bilgi--error');
    }
    // olusturulanBilgi.classList.add(durum ? 'bilgi--success' : 'bilgi--error');  

    document.querySelector('.container').insertBefore(olusturulanBilgi, form);                 //olusturulanBilgi-div ini form öğesinin öncesinde oluşturuyoruz

    // setTimeout:örnk iki saniyede sonra kodu çalıştır, setInteval: her iki saniyede bir  kodu çalışatıtır.
    setTimeout(function () {
        const silinecekDiv = document.querySelector('.bilgi');
        if (silinecekDiv) {                                                                   //if(silinecekDeger) silinecek değer ekranda varsa 
            silinecekDiv.remove();
        }
    }, 2000);                                                                                 //kaç ms niyede gerçekkleşeceğini burada belirtiyorum
}

function alanlariTemizle() {
    ad.value = '';
    soyad.value = '';
    mail.value = '';
}



