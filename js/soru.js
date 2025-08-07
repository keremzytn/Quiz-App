function Soru(soruMetni, cevapSecenekleri, dogruCevap, kategori = "Genel", zorluk = "Orta", ipucu = "") {
    this.soruMetni = soruMetni;
    this.cevapSecenekleri = cevapSecenekleri;
    this.dogruCevap = dogruCevap; 
    this.kategori = kategori;
    this.zorluk = zorluk;
    this.ipucu = ipucu;
}

Soru.prototype.cevabiKontrolEt = function(cevap) {
    return cevap === this.dogruCevap;   
};