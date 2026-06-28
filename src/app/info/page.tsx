"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import Link from "next/link";
import {
  ChevronDown,
  BookOpen,
  Eye,
  Heart,
  Users,
  Megaphone,
  HandHeart,
  Church,
  Landmark,
  Star,
  ArrowLeft,
  FileText,
  Music,
  Scale,
  Home,
  ChevronRight,
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const sejarahTimeline = [
  {
    tahun: "1962",
    judul: "Awal Pergolakan",
    isi: "Berbagai perselisihan internal mulai terjadi di dalam tubuh Huria Kristen Batak Protestan (HKBP). Ketegangan teologis dan organisatoris ini menciptakan tekanan yang mendalam di kalangan jemaat dan pelayan gereja, menuntut jawaban yang didasarkan pada Firman Tuhan.",
  },
  {
    tahun: "1964",
    judul: "Berdirinya GKPI",
    isi: "Gereja Kristen Protestan Indonesia (GKPI) resmi berdiri di Pematangsiantar pada tanggal 30 Agustus 1964. Pendirian ini merupakan buah dari pergumulan panjang jemaat yang merindukan persekutuan yang sehat, penuh kasih, dan berlandaskan Firman Tuhan.",
  },
  {
    tahun: "1966",
    judul: "Pengakuan Negara",
    isi: "GKPI resmi terdaftar sebagai badan gerejawi di Departemen Agama Republik Indonesia dengan Nomor D4/P/II/SK/01/66 tanggal 15 November 1966. Selanjutnya diakui sebagai Badan Kerohanian berdasarkan Kep. Pres. No. 133/1953 No. LXV tanggal 26 November 1966.",
  },
  {
    tahun: "1984",
    judul: "Konsolidasi & Pertumbuhan",
    isi: "GKPI terus bertumbuh dan mengkonsolidasikan struktur pelayanannya. Berbagai resort dan jemaat khusus dibentuk untuk memperluas jangkauan pelayanan dari Sumatera hingga ke berbagai pelosok Indonesia, menjawab panggilan untuk 'Membayar Hutang Penginjilan'.",
  },
  {
    tahun: "2013",
    judul: "Pembaruan Tata Gereja",
    isi: "Sidang Sinode menetapkan Tata Gereja dan Peraturan Rumah Tangga GKPI yang diperbarui, memperkuat fondasi hukum, tata kelola, dan semangat pelayanan gereja memasuki era modern dengan tetap menjunjung tinggi nilai-nilai Reformasi.",
  },
  {
    tahun: "2015",
    judul: "Visi Strategis 2015–2030",
    isi: "GKPI menetapkan Visi Strategis 'Menjadi Persekutuan Penyembahan dan Persembahan pada Tahun 2030' sebagai arah perjuangan bersama. Renstra ini memandu seluruh program pelayanan dalam lima bidang Panca Pelayanan GKPI selama 15 tahun ke depan.",
  },
];

const misiCards = [
  {
    icon: Users,
    nama: "Koinonia",
    label: "Persekutuan",
    deskripsi:
      "GKPI terpanggil untuk membangun persekutuan sebagai bagian dari Gereja Yang Esa, Kudus, Am, dan Rasuli yang dikiaskan sebagai tubuh Kristus. Persekutuan itu nampak dalam ibadah, doa, dan saling tolong-menolong antar jemaat.",
    warna: "from-blue-500/20 to-cyan-500/20",
    aksen: "text-cyan-400",
    border: "border-cyan-500/20",
  },
  {
    icon: Megaphone,
    nama: "Marturia",
    label: "Kesaksian",
    deskripsi:
      "GKPI terpanggil untuk menjadi saksi Kristus di tengah-tengah dunia. Setiap anggota jemaat dipanggil untuk memberitakan Injil kepada sesama dengan perbuatan dan perkataan, menjangkau jiwa-jiwa yang belum mengenal Kristus.",
    warna: "from-amber-500/20 to-yellow-500/20",
    aksen: "text-amber-400",
    border: "border-amber-500/20",
  },
  {
    icon: HandHeart,
    nama: "Diakonia",
    label: "Pelayanan",
    deskripsi:
      "GKPI terpanggil untuk melayani sesama tanpa membedakan latar belakang. Pelayanan kasih nyata diwujudkan melalui kepedulian sosial, bantuan kepada yang membutuhkan, dan pembelaan terhadap keadilan di tengah masyarakat.",
    warna: "from-rose-500/20 to-pink-500/20",
    aksen: "text-rose-400",
    border: "border-rose-500/20",
  },
  {
    icon: Church,
    nama: "Liturgia",
    label: "Ibadah",
    deskripsi:
      "GKPI terpanggil untuk mewujudkan ibadah yang benar kepada Tuhan. Liturgi yang kaya dan bermakna menjadi sarana jemaat bertemu dengan Allah yang hidup, sehingga setiap ibadah menjadi pengalaman rohani yang memperbarui dan menguatkan iman.",
    warna: "from-purple-500/20 to-violet-500/20",
    aksen: "text-purple-400",
    border: "border-purple-500/20",
  },
  {
    icon: Landmark,
    nama: "Oikonomia",
    label: "Penatalayanan",
    deskripsi:
      "GKPI terpanggil untuk mengelola segala karunia Tuhan—waktu, talenta, dan harta—dengan penuh tanggung jawab dan bijaksana. Penatalayanan yang baik mencakup pengelolaan keuangan, properti, dan sumber daya gereja demi kemuliaan Tuhan.",
    warna: "from-emerald-500/20 to-green-500/20",
    aksen: "text-emerald-400",
    border: "border-emerald-500/20",
  },
];

const dokumenProfile = [
  {
    icon: BookOpen,
    judul: "Sejarah GKPI",
    deskripsi: "Perjalanan panjang berdirinya GKPI dari 1964 hingga kini.",
    tag: "Sejarah",
  },
  {
    icon: Eye,
    judul: "Visi dan Misi",
    deskripsi: "Renstra GKPI 2015–2030: Persekutuan Penyembahan & Persembahan.",
    tag: "Renstra",
  },
  {
    icon: Music,
    judul: "Mars GKPI",
    deskripsi: "Lagu mars kebanggaan jemaat GKPI di seluruh Indonesia.",
    tag: "Musik",
  },
  {
    icon: FileText,
    judul: "Tata Gereja GKPI (2013)",
    deskripsi: "Landasan hukum dan konstitusi organisasi gereja GKPI.",
    tag: "Dokumen",
  },
  {
    icon: Scale,
    judul: "Peraturan Rumah Tangga",
    deskripsi: "Pedoman tata kelola dan administrasi jemaat GKPI.",
    tag: "Dokumen",
  },
  {
    icon: Home,
    judul: "Pengakuan Iman",
    deskripsi: "Pengakuan iman yang menjadi dasar ajaran dan doktrin GKPI.",
    tag: "Iman",
  },
];

const dokumenDetail = [
  {
    id: "sejarah",
    judul: "Sejarah GKPI",
    tag: "Sejarah",
    sections: [
      {
        title: "Pengantar Sejarah",
        content: `Gereja di segala abad dan tempat menghadapi berbagai tantangan dan pertanyaan, baik yang bersifat klasik maupun yang baru sejalan dengan perkembangan zaman dan konteksnya. Terhadap semua itu gereja harus memberi jawab, jawaban itu harus bersumber dari dan didasarkan pada Firman Tuhan di dalam Alkitab sebagai satu-satunya sumber ajaran dan norma yang benar.\n\nDemikian juga Gereja Kristen Protestan Indonesia (GKPI). GKPI adalah bagian dari Tubuh Kristus yang esa, kudus, am dan rasuli di muka bumi ini. GKPI adalah juga suatu persekutuan yang secara khas hadir di negara Republik Indonesia ini. Sejak berdirinya tanggal 30 Agustus 1964, GKPI ditantang untuk memberi jawab atas berbagai pertanyaan dan masalah yang menyangkut banyak hal mendasar yang diimaninya, dalam rangka menyatakan ketaatan dan kesetiaannya kepada Tuhan Yesus Kristus, Raja Gereja dan Juruselamat dunia.`
      },
      {
        title: "Pokok-Pokok Pemahaman Iman",
        content: `Ada berbagai jawaban yang telah dikemukakan dan dirumuskan GKPI di sepanjang sejarah dan perjalanannya. Jawaban dan pernyataan iman itu tersebar di berbagai dokumen, berupa keputusan-keputusan dan pesan-pesan Sinode Am dan Rapat Pendeta, maupun berbagai hasil pertemuan dan persidangan di semua aras (tingkatan), dari tingkat Jemaat hingga Pusat. Karena sifat dan bentuknya tersebar dan tidak tersusun padu, GKPI perlu menyusun dan memiliki rumusan yang lebih lengkap dan terpadu, agar dapat dipedomani dan digunakan seluruh warga dan pelayan GKPI tatkala menghadapi berbagai pertanyaan dan masalah yang menyangkut iman mereka.\n\nDengan demikian Pokok Pokok Pemahaman Iman GKPI ini berfungsi sebagai:\n\n- Pedoman dan tuntunan bagi seluruh jajaran GKPI dalam hal ajaran, supaya tidak diombang-ambingkan oleh rupa-rupa angin pengajaran (Ef. 4:14) dan supaya dapat menjawab perkara-perkara mendasar yang berkaitan dengan imannya;\n- Pedoman dan acuan bagi warga dan pelayan GKPI dalam merumuskan bentuk, isi, dan tujuan kesaksian dan pelayanan, demikian juga dalam menyusun peraturan dan program GKPI di semua aras;\n- Pedoman dan acuan untuk memberi jawab dan pertanggungjawaban tentang imannya terhadap berbagai pengajaran dan nilai yang terus menerus bermunculan dan berubah, sekaligus menolaknya kalau ternyata bertentangan dengan iman kristiani.`
      },
      {
        title: "Sumber dan Acuan Pengakuan",
        content: `Pokok-Pokok Pemahaman Iman GKPI ini bersumber dan berdasar pada Alkitab. Karena itu tidak dimaksudkan sebagai pengganti ataupun tandingan Alkitab. Namun di lain pihak dokumen ini hendak juga mencerminkan pemahaman dan penafsiran atas amanat Alkitab secara aktual, sehingga Alkitab sungguh-sungguh bersuara secara relevan pada masa kini, dan pesannya menjadi jelas bagi para warga dan pelayan GKPI.\n\nPokok-Pokok Pemahaman Iman GKPI ini juga mengacu pada sejumlah dokumen iman gereja dari segala abad, terutama yang dipelihara dalam tradisi iman gereja reformatoris, antara lain Pengakuan Iman Rasuli, Pengakuan Iman Nicea-Konstantinopel, Pengakuan Iman Athanasianum, Katekhismus Martin Luther dan Konfessi Augsburg, demikian juga pokok-pokok ajaran bapa-bapa gereja yang diakui sebagai bersifat ekumenis dan reformatoris. Dan sebagai bagian dari gereja Kristen yang mengesa di Indonesia, Pokok-Pokok Pemahaman Iman ini juga mengacu kepada Pemahaman Bersama Iman Kristen di Indonesia (PBIK), salah satu dari Lima Dokumen Keesaan Gereja (LDKG) yang dirumuskan bersama di dalam Persekutuan Gereja-Gereja di Indonesia (PGI).`
      }
    ]
  },
  {
    id: "visi-misi",
    judul: "Visi, Misi & Renstra",
    tag: "Renstra",
    sections: [
      {
        title: "Visi Strategis 2015-2030",
        content: `“MENJADI PERSEKUTUAN PENYEMBAHAN DAN PERSEMBAHAN PADA TAHUN 2030”`
      },
      {
        title: "Misi (Panca Pelayanan GKPI)",
        content: `Dalam rangka mendukung Visi, Misi GKPI dijabarkan dalam Panca Pelayanan GKPI:\n\n- **Koinonia (Persekutuan)**: GKPI terpanggil untuk membangun persekutuan sebagai bagian dari Gereja Yang Esa, Kudus, Am, dan Rasuli yang dikiaskan sebagai Tubuh Kristus. Persekutuan itu nampak dalam persekutuan jemaat, antara jemaat dan sesama dalam masyarakat, yang mencerminkan kasih Kristus.\n- **Marturia (Kesaksian)**: GKPI terpanggil mewujudkan-nyatakan syalom Allah sebagai berita kesukaan yang utuh dan menyeluruh untuk segala makhluk dalam keutuhan ciptaan.\n- **Diakonia (Pelayanan)**: GKPI terpanggil untuk mewujudkan-nyatakan kasih Allah kepada sesama manusia secara utuh dan menyeluruh.\n- **Liturgia (Ibadah)**: GKPI terpanggil untuk melaksanakan "Ibadah Sejati" dalam seluruh kehidupan untuk memuliakan Allah.\n- **Oikonomia (Penatalayanan)**: GKPI terpanggil untuk melaksanakan tugas memelihara dan mengelola dunia ciptaan Allah dengan bijaksana dan adil serta bertanggung jawab kepada Allah. Dalam tugas mengelola semua ciptaan sebagai rumah tangga Allah, gereja membutuhkan sistem kelembagaan yang handal dalam rangka optimalisasi pelayanannya bagi kemuliaan Allah.`
      },
      {
        title: "Tema & Sub-Tema Periode 2020-2025",
        content: `**Tema:**\n“Gembalakanlah kawanan Domba Allah” (1 Petrus 5:2a)\n\n**Sub-Tema:**\nMeningkatkan Peran Serta GKPI sebagai gereja yang misional dan diakonal dalam menegakkan keadilan, perdamaian, dan keutuhan ciptaan.`
      },
      {
        title: "Road Map Tahap II (Perkuatan) 2020-2025",
        content: `**Tahun Pertama (2021) - Pelatihan Pelayan Gereja:**\n- Peningkatan peranan penatua dan diaken\n- Program Pembinaan Katekhisasi\n- Penguatan Kepemimpinan Ibadah\n- Pelatihan penggunaan multimedia dan alat peraga bagi pendeta/penatua\n- Pelatihan Manajemen waktu\n- Teori dan Praktek tentang khotbah kontekstual\n- Pelatihan bermain musik dan menyanyi yang benar\n- Mencari alternatif dan metode pelayanan dan ibadah yang kreatif\n\n**Tahun Kedua (2022) - Pelayanan Pastoral:**\n- Pelatihan program konseling kepada pendeta, penatua, diakones\n- Menerapkan program pastoral yang sudah disiapkan jemaat masing-masing\n- Meningkatkan kapasitas para pendeta, penatua, evangelis, diakones, dan majelis jemaat dalam pelayanan pastoral\n\n**Tahun Ketiga (2023) - Memelihara & Memperdulikan Jemaat-jemaat:**\n- Membuat program pelatihan kepedulian\n- Pelaksanaan program kepedulian\n- Program perayaan khusus (hari-hari raya gerejawi, hari ulang tahun lembaga, dll)\n\n**Tahun Keempat (2024) - Menuju Gereja yang Ceria dan Ramah:**\n- Program penataan manajemen ibadah\n- Membangun model-model kebaktian yang kontekstual dan menarik bagi anak-anak, remaja, pemuda\n- Ketersediaan alat-alat musik di masing-masing jemaat\n- Membangun komunikasi antar kantor sinode dan jemaat, antar jemaat dalam satu korwil, antar majelis jemaat dengan anggota\n- Program pembangunan, pemeliharaan sarana dan prasarana gereja\n- Penyelenggaraan seminar ceria dan ramah bagi para pendeta, penatua, diaken, dan majelis jemaat\n\n**Tahun Kelima (2025) - Merencanakan Pertumbuhan:**\n- Meningkatkan persekutuan antar jemaat setelah selesai ibadah\n- Meningkatkan pemberitaan Firman Tuhan ke dalam dan ke luar lingkungan gereja\n- Meningkatkan eksistensi atau kehadiran gereja di tengah-tengah masyarakat\n- Membuat ibadah kreatif berdasarkan kondisi dan lingkungan\n- Meningkatkan pemahaman 'memberi dan melakukannya' (Matius 25:40)`
      }
    ]
  },
  {
    id: "mars-gkpi",
    judul: "Mars GKPI",
    tag: "Musik",
    isMars: true,
    lyrics: `**MARS GKPI**\n\nGereja Kristen Protestan Indonesia,\nGereja Tuhan, gereja tercinta.\nYa, Tuhan Yesus Kepala Gereja,\nDialah Tuhan Juru S'lamat s'luruh dunia.\n\nGKPI gereja Tuhan yang Esa,\nImamat kudus dan rasuli serta am.\nGKPI gereja Kristen yang teduh,\nMembuat hati serta iman pun teguh.\n\nRukun bersama melayani dengan tulus,\nMemberitakan Injil Tuhan yang Kudus.\n\nGereja Kristen Protestan Indonesia,\nGereja Tuhan, gereja tercinta,\nPersekutuan orang-orang yang percaya,\nBahwa Tuhan Yesus Kristus itu Anak Allah.\n\nYa, Tuhan Yesus Kepala Gereja,\nDialah juga Juru S'lamat s'luruh dunia.`
  },
  {
    id: "tata-gereja",
    judul: "Tata Gereja GKPI (2013)",
    tag: "Dokumen",
    isArticles: true,
    mukadimah: `GEREJA KRISTEN PROTESTAN INDONESIA adalah persekutuan orang-orang percaya kepada Tuhan Yesus sebagai Anak Allah, Kristus dan Juruselamat dunia, dan merupakan bagian dari Tubuh Kristus yang tersebar di atas bumi, yang diberdayakan oleh Roh Kudus untuk hidup dalam suatu persekutuan, kesaksian dan pelayanan di tengah dunia dalam melaksanakan rencana-Nya terhadap dunia yakni supaya kasih, sukacita, keadilan, kebenaran, dan damai sejahtera berlaku dalam seluruh ciptaan-Nya.\n\nGereja Kristen Protestan Indonesia adalah Badan Gerejawi di Indonesia, sebagai satu sinode lahir dan berdiri dilandasi oleh kasih setia dari Allah Bapa, anugerah dari Tuhan Yesus Kristus dan Persekutuan dari Roh Kudus; serta didorong oleh kerinduan untuk ikut melaksanakan misi Allah di dunia dalam tugas-panggilan imamat am orang percaya (1 Petrus 2:9), dan kerinduan untuk melaksanakan pembaruan dan pemurnian pelayanan dalam kehidupan bergereja, dengan berpedoman kepada Tata Gereja ini.\n\nBahwa "TATA GEREJA" Gereja Kristen Protestan Indonesia ini hidup dari Firman Allah, untuk penatalayanan Gereja, agar gereja hidup dari Iman, Harap dan Kasih Tuhan Yesus Kristus, Gembala yang baik. Dinamika "Tata Gereja" ini terletak pada jiwa kasih Yesus Kristus yang tersimpul didalam "kata" dan "kalimat" maupun "tata susunannya"; itulah yang mendorong dan menggerakkan seluruh kehidupan dan pelayanannya. Kasih, kebenaran dan aturan yang ada dalam Alkitab menjadi sumber yang utama dan dasar ukuran penafsiran Tata Gereja ini. Tata Gereja ini bukan mempersempit jalan melainkan melapangkan jalan untuk bertemu dengan Tuhan Yesus Kristus Raja Gereja, Gembala yang baik.`,
    articles: [
      {
        pasal: "Pasal I",
        judul: "Nama dan Tempat Kedudukan",
        isi: "(1) Badan Gerejawi ini bernama GEREJA KRISTEN PROTESTAN INDONESIA, selanjutnya disingkat dengan GKPI.\n(2) GKPI lahir dan berdiri pada tanggal 30 Agustus 1964 di kota Pematangsiantar, Provinsi Sumatera Utara, Indonesia.\n(3) GKPI sebagai bagian dari Gereja yang esa, kudus dan am di seluruh dunia, hadir dan berkedudukan di Indonesia dan ber-Kantor Sinode di Pematangsiantar, Sumatera Utara - Indonesia, dan didirikan untuk waktu yang tidak ditentukan lamanya."
      },
      {
        pasal: "Pasal II",
        judul: "Pengakuan dan Tujuan",
        isi: "(1) GKPI mengaku percaya kepada Allah Bapa, Anak dan Roh Kudus, Tritunggal yang Esa, dan mengaku percaya bahwa Yesus Kristus adalah Tuhan dan Juruselamat dunia, sesuai dengan Firman Allah di dalam Alkitab, yaitu Perjanjian Lama dan Perjanjian Baru. Pengakuan ini menggerakkan dan menerangi seluruh gerak hidup anggota Jemaat di GKPI.\na. GKPI dalam persekutuan dengan gereja dari segala abad dan tempat menghayati pengakuan imannya berpedoman pada ketiga pengakuan iman ekumenis, yaitu: Pengakuan Iman Rasuli, Pengakuan Iman Nicea-Konstantinopel dan Pengakuan Iman Athanasianum.\nb. Dalam persekutuan dengan Gereja-gereja Lutheran, GKPI menerima Katekhismus Dr. Martin Luther.\nc. GKPI menjabarkan pengakuan imannya dalam Pokok-Pokok Pemahaman Iman GKPI.\n(2) GKPI bertujuan untuk memberitakan Injil dengan pengamalan dan pelayanan berdasarkan kasih setia Allah Bapa, Anugerah dari Tuhan Yesus Kristus, dan Persekutuan dari Roh Kudus supaya nama Allah dipermuliakan dan manusia berdosa dalam penebusan Yesus Kristus menjadi pewaris Kerajaan Allah, sesuai dengan rencana keselamatan Allah: “Supaya orang percaya beroleh kehidupan yang kekal” (Yohanes 3:16)."
      },
      {
        pasal: "Pasal III",
        judul: "Asas Bermasyarakat, Berbangsa dan Bernegara",
        isi: "Dalam kehidupan bermasyarakat, berbangsa dan bernegara GKPI berazaskan Pancasila."
      },
      {
        pasal: "Pasal IV",
        judul: "Pelaksanaan Tugas Panggilan",
        isi: "Untuk mencapai tujuan tersebut GKPI melaksanakan kewajiban:\n(1) Tugas panggilan Gereja:\na. Apostolat/Marturia: Memberitakan Firman Allah, menyelenggarakan peribadatan, melayankan sakramen Baptisan Kudus dan Perjamuan Kudus, menahbiskan pelayan-pelayan Gereja, melakukan pemberitaan Injil dan penegakan ajaran yang benar.\nb. Pastorat/Koinonia/Liturgia: Menyekolahkan, mendidik dan membina pelayan-pelayan Gereja, melaksanakan pengajaran dan pendidikan di dalam Firman Allah, katekhisasi, pembinaan warga gereja.\nc. Diakonat/Diakonia: Melaksanakan kesaksian rahmat Allah dengan menjalankan usaha-usaha sosial kemanusiaan, pengembangan/pembangunan masyarakat dan pemeliharaan keutuhan ciptaan.\n(2) Turut serta memelihara hubungan ekumenis dengan Gereja-gereja dan Lembaga-lembaga Kristen di dalam dan di luar negeri.\n(3) Membimbing warga gereja menjadi warga negara yang baik, yang bertanggungjawab bagi Tuhan dan negara, serta memelihara kerukunan di dalam Negara Kesatuan Republik Indonesia.\n(4) Mendirikan Badan/Lembaga pelayanan, baik yang berbadan hukum atau tidak berbadan hukum, guna melaksanakan tugas-tugas gereja."
      },
      {
        pasal: "Pasal V",
        judul: "Keanggotaan",
        isi: "(1) Anggota GKPI adalah yang telah dibaptiskan di GKPI yaitu: Anak-anak dan orang dewasa.\n(2) Orang-orang Kristen yang atas permintaan sendiri menjadi anggota GKPI."
      },
      {
        pasal: "Pasal VI",
        judul: "Struktur",
        isi: "(1) Struktur GKPI terdiri dari:\na. Jemaat-jemaat;\nb. Jemaat-jemaat atau Jemaat Khusus tergabung dalam satu kesatuan pelayanan Resort.\nc. Jemaat-jemaat se-Resort dan Jemaat Khusus terhimpun dalam Sinode GKPI.\n(2) Jemaat adalah wujud persekutuan, kesaksian dan pelayanan anggota-anggota GKPI di mana Firman Allah diberitakan dan Sakramen dilayankan.\n(3) Resort adalah sejumlah Jemaat atau satu Jemaat Khusus yang tergabung dalam satu kesatuan pelayanan dan kepemimpinan Pendeta.\n(4) Sinode Am adalah lembaga tertinggi di GKPI yang merupakan perwujudan nyata dari keseluruhan Jemaat dan Resort GKPI dalam bentuk persidangan Sinode Am.\n(5) Sinode adalah wujud persekutuan dari keseluruhan GKPI sebagai satu Badan Gerejawi."
      },
      {
        pasal: "Pasal VII",
        judul: "Kepemimpinan",
        isi: "(1) Jemaat GKPI dipimpin oleh Pengurus Jemaat.\n(2) Resort GKPI dipimpin oleh Pengurus Resort.\n(3) Sinode GKPI dipimpin oleh Pimpinan Sinode (Bishop dan Sekretaris Jenderal), yang bertanggungjawab dan berwenang mewakili GKPI di dalam dan di luar pengadilan serta mengikat GKPI dalam perjanjian dengan pihak ketiga."
      },
      {
        pasal: "Pasal VIII",
        judul: "Pelayan-Pelayan Gereja",
        isi: "Untuk mencapai tujuan dan mewujudkan rencana-rencana GKPI, seluruh anggota Jemaat dipanggil untuk bertanggungjawab di bidang spiritual dan material berdasarkan imamat am orang percaya (1 Petrus 2:9). Khusus untuk membimbing dan melayani serta mencerminkan pelayanan Yesus Kristus, GKPI mengangkat Pelayan-pelayan Gereja di bidang Kerohanian (Pendeta, Penatua, Evangelis, Diakones) dan di bidang Umum."
      },
      {
        pasal: "Pasal IX",
        judul: "Rapat/Sidang",
        isi: "(1) Untuk kepentingan GKPI diadakan Sidang/Rapat sesuai dengan keperluannya, yaitu pada tingkat Jemaat, Resort, Sinode, Sinode Am dan Badan/Lembaga lainnya.\n(2) Semua Sidang/Rapat dimulai dan diakhiri dengan nyanyian dan doa.\n(3) Keputusan Sidang/Rapat diambil sedapat mungkin dengan jalan musyawarah untuk mufakat. Jika tidak tercapai, keputusan diambil berdasarkan pemungutan suara terbanyak (lebih dari setengah jumlah suara hadir)."
      },
      {
        pasal: "Pasal X",
        judul: "Harta Benda",
        isi: "Harta benda dan seluruh perbendaharaan milik GKPI diperoleh dari persembahan jemaat, sumbangan sukarela, dan hasil usaha resmi lainnya yang dikelola secara bertanggung jawab, transparan, dan dipergunakan sepenuhnya untuk pelayanan serta misi gereja."
      }
    ]
  },
  {
    id: "prt",
    judul: "Peraturan Rumah Tangga",
    tag: "Dokumen",
    isPRT: true,
    chapters: [
      {
        bab: "BAB I",
        judul: "Jemaat dan Anggota Jemaat",
        isi: "**Pasal 1: Jemaat dan Anggota Jemaat**\n(1) Jemaat adalah wujud persekutuan, kesaksian pelayanan dan kesaksian anggota-anggota GKPI di suatu tempat di mana firman Tuhan diberitakan dan sakramen dilayankan.\n(2) Anggota GKPI adalah mereka yang telah dibaptis dan terdaftar sebagai anggota Jemaat GKPI dalam Buku Induk Jemaat, yang terdiri dari:\na. Anggota baptis: yang telah dibaptis tetapi belum sidi.\nb. Anggota sidi: yang telah dibaptis dan telah sidi.\nc. Anggota bimbingan: Anggota yang berada dalam bimbingan berdasarkan Tata Penggembalaan Khusus GKPI, atau orang yang sedang dipersiapkan menjadi anggota.\n\n**Pasal 2: Hak dan Kewajiban Anggota Jemaat**\n(1) Setiap anggota Jemaat berhak memperoleh pelayanan, bimbingan, dan pembinaan yang sama. Anggota sidi berhak memilih dan dipilih menjadi Pelayan, Pengurus, atau Panitia di Jemaatnya.\n(2) Setiap anggota Jemaat wajib menaati Alkitab, Tata Gereja, PRT, mendukung kegiatan pelayanan dengan daya dan dana, serta taat mengikuti peribadatan."
      },
      {
        bab: "BAB II",
        judul: "Pengorganisasian dan Kepemimpinan Jemaat",
        isi: "**Pasal 5: Pengurus Jemaat**\nPengurus Jemaat adalah badan pimpinan harian yang melaksanakan pelayanan spiritual dan administratif di tingkat Jemaat, yang dipimpin oleh seorang Guru Jemaat (Penatua) dibantu oleh para Penatua lainnya.\n\n**Pasal 10: Rapat Jemaat**\nRapat Jemaat adalah forum pengambilan keputusan tertinggi di tingkat Jemaat untuk mengevaluasi program kerja, anggaran belanja, dan memilih calon pengurus jemaat."
      },
      {
        bab: "BAB III & IV",
        judul: "Resort & Pengorganisasian Resort",
        isi: "**Pasal 27: Resort**\nResort adalah wadah persekutuan dari beberapa jemaat terdekat untuk mengoordinasikan pelayanan spiritual secara kolektif.\n\n**Pasal 30: Kepemimpinan Resort**\nSetiap Resort dipimpin oleh seorang Pendeta Resort yang diangkat dan ditempatkan oleh Pimpinan Sinode untuk melayani sakramen dan menggembalakan jemaat-jemaat di wilayah resort tersebut."
      },
      {
        bab: "BAB V, VI & VII",
        judul: "Sinode Am, Majelis Sinode, & Pimpinan Sinode",
        isi: "**Pasal 44: Sinode Am**\nSinode Am adalah persidangan perwakilan seluruh Resort GKPI yang memegang kedaulatan tertinggi untuk menetapkan arah kebijakan strategis gereja.\n\n**Pasal 51: Majelis Sinode**\nMajelis Sinode adalah badan legislatif dan pengawas harian yang menjalankan amanat Sinode Am di antara masa persidangan.\n\n**Pasal 57: Pimpinan Sinode**\nPimpinan Sinode terdiri dari Bishop dan Sekretaris Jenderal yang dipilih dalam Sinode Am untuk masa bakti 5 tahun, bertugas memimpin roda pelayanan spiritual dan administrasi pusat."
      },
      {
        bab: "BAB XIV",
        judul: "Pelayan-Pelayan Gereja",
        isi: "**Pasal 81: Jabatan Pelayan**\nPelayan rohani di GKPI terdiri atas Pendeta, Penatua (Sintua), Evangelis (Guru Injil), dan Diakones.\n\n**Pasal 85: Penempatan & Mutasi**\nPendeta dan Diakones diangkat dan ditempatkan oleh Pimpinan Sinode secara berkala (mutasi) untuk menjamin penyegaran dan pemerataan pelayanan di seluruh wilayah GKPI."
      }
    ]
  },
  {
    id: "pengakuan-iman",
    judul: "Pengakuan Iman",
    tag: "Iman",
    isConfession: true,
    pengantar: `Pokok-Pokok Pemahaman Iman GKPI dirumuskan secara khusus untuk mempertegas identitas iman dan ajaran teologi GKPI di tengah tantangan zaman. Dokumen ini disahkan secara resmi pada persidangan Sinode Am XI GKPI pada tanggal 20–24 September 1993 di Pematangsiantar. Ia berfungsi sebagai pedoman pengajaran (katekismus) dan dasar apologetika ajaran gereja bagi segenap pelayan dan jemaat.`,
    isiConfession: `“Gereja Kristen Protestan Indonesia (GKPI) mengaku Yesus Kristus, Tuhan dan Juruselamat Gereja, sesuai dengan Firman Allah dalam Alkitab, yaitu Perjanjian Lama dan Perjanjian Baru. Pengakuan ini menggerakkan dan menerangi seluruh gerak hidup Warga Jemaat di GKPI.”`,
    points: [
      {
        title: "1. Allah Tritunggal",
        detail: "GKPI mempercayai Allah yang Esa dalam tiga Pribadi: Bapa Pencipta alam semesta, Anak (Yesus Kristus) Penebus dosa manusia, dan Roh Kudus Yang Menghidupkan, Menuntun, dan Menguduskan persekutuan orang percaya."
      },
      {
        title: "2. Alkitab",
        detail: "Alkitab (Perjanjian Lama dan Perjanjian Baru) diakui sebagai Firman Allah yang tertulis, diilhamkan oleh Roh Kudus, dan menjadi satu-satunya dasar mutlak serta norma yang benar bagi seluruh ajaran, tata ibadah, dan jalan hidup orang Kristen."
      },
      {
        title: "3. Keselamatan dan Pembenaran",
        detail: "Manusia yang berdosa tidak dapat menyelamatkan dirinya sendiri dengan perbuatan baiknya. Pembenaran dan keselamatan hanya diperoleh sebagai anugerah cuma-cuma (Sola Gratia) dari Allah melalui iman (Sola Fide) kepada pengorbanan Yesus Kristus di kayu salib."
      },
      {
        title: "4. Gereja",
        detail: "Gereja adalah persekutuan orang-orang percaya yang dipanggil Allah dari kegelapan dosa menuju terang keselamatan-Nya. Gereja diakui berciri Esa, Kudus, Am (universal), dan Rasuli, yang dipimpin oleh Kristus sendiri sebagai Kepala Gereja."
      },
      {
        title: "5. Sakramen",
        detail: "GKPI menyelenggarakan dua sakramen yang ditetapkan langsung oleh Tuhan Yesus Kristus: Baptisan Kudus (sebagai meterai masuk ke dalam persekutuan Allah bagi anak-anak dan dewasa) dan Perjamuan Kudus (sebagai pembaharuan iman melalui roti dan anggur yang menyimbolkan tubuh dan darah Kristus)."
      },
      {
        title: "6. Kewajiban & Panggilan Hidup",
        detail: "Sebagai respon atas kasih karunia Allah, setiap warga GKPI dipanggil untuk hidup kudus dan melaksanakan tugas Panca Pelayanan di tengah dunia: bersekutu (Koinonia), bersaksi (Marturia), melayani sesama (Diakonia), beribadah sejati (Liturgia), serta menata ciptaan-Nya (Oikonomia)."
      }
    ]
  }
];

// ─── Accordion Component ──────────────────────────────────────────────────────

function AccordionItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: (typeof sejarahTimeline)[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative flex gap-6 md:gap-10 group">
      {/* Timeline line */}
      <div className="flex flex-col items-center shrink-0">
        <button
          onClick={onToggle}
          aria-expanded={isOpen}
          className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-300 shrink-0
            ${isOpen
              ? "bg-accent border-accent shadow-[0_0_20px_rgba(111,168,220,0.4)]"
              : "bg-surface border-border group-hover:border-accent/50"
            }`}
        >
          <span
            className={`font-serif font-bold text-xs md:text-sm ${
              isOpen ? "text-background" : "text-accent"
            }`}
          >
            {item.tahun.slice(-2)}
          </span>
        </button>
        {index < sejarahTimeline.length - 1 && (
          <div
            className={`w-0.5 flex-1 mt-2 transition-colors duration-500 ${
              isOpen ? "bg-accent/30" : "bg-border/50"
            }`}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-8 md:pb-10">
        <button
          onClick={onToggle}
          className="w-full text-left"
          aria-expanded={isOpen}
        >
          <div
            className={`flex items-center justify-between p-5 md:p-6 rounded-2xl border transition-all duration-300 cursor-pointer
              ${isOpen
                ? "bg-surface/80 border-accent/30 shadow-lg shadow-accent/5"
                : "bg-surface/40 border-border/60 hover:border-accent/20 hover:bg-surface/60"
              }`}
          >
            <div className="flex items-center gap-4">
              <span
                className={`text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full transition-colors duration-300
                  ${isOpen
                    ? "bg-accent/20 text-accent"
                    : "bg-primary/10 text-text-secondary"
                  }`}
              >
                {item.tahun}
              </span>
              <h3
                className={`font-serif text-lg md:text-xl font-bold transition-colors duration-300 ${
                  isOpen ? "text-text-primary" : "text-text-secondary"
                }`}
              >
                {item.judul}
              </h3>
            </div>
            <ChevronDown
              size={20}
              className={`shrink-0 text-accent transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {/* Expandable body */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-5 md:px-6 pt-3 pb-2">
            <p className="text-text-secondary leading-relaxed text-base md:text-lg">
              {item.isi}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InfoPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedDocIndex, setSelectedDocIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  // Scroll lock when modal opens
  useEffect(() => {
    if (selectedDocIndex !== null) {
      document.body.style.overflow = "hidden";
      setActiveTab(0); // reset tab to first section/article
    } else {
      document.body.style.overflow = "";
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedDocIndex]);

  // Audio player state tracking
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((err) => console.log("Audio play error: ", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration || 0;
      setAudioProgress(current);
      setAudioDuration(duration);
    }
  };

  const handleAudioLoaded = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration || 0);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setAudioProgress(0);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setAudioProgress(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleToggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[86vh] items-end overflow-hidden bg-background pb-10 pt-32 md:min-h-[90vh] md:pb-14">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero_slide_3.png"
            alt="Alkitab dan dasar iman GKPI"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            quality={90}
          />
          <div className="absolute inset-0 bg-primary/70 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/75 via-primary/45 to-background/95" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/25 to-background/70" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-text-primary/75 transition-colors hover:text-accent"
            >
              <ArrowLeft size={14} />
              Beranda
            </Link>
            <ChevronRight size={14} className="text-text-primary/30" />
            <span className="text-sm font-medium text-accent">
              Profil GKPI
            </span>
          </nav>

          <ScrollReveal>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-accent drop-shadow-lg">
              Gereja Kristen Protestan Indonesia
            </p>
            <h1
              className="mb-6 max-w-4xl text-5xl font-bold leading-[1.02] text-white drop-shadow-2xl sm:text-6xl lg:text-7xl"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Profil dan Identitas GKPI
            </h1>
            <p className="max-w-2xl text-base leading-8 text-text-primary/90 drop-shadow-lg md:text-xl">
              Mengenal lebih dalam Gereja Kristen Protestan Indonesia — sejarah,
              visi misi, dan identitas gereja yang telah melayani selama lebih
              dari 60 tahun.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="mt-9 flex flex-wrap gap-3">
              {[
                { label: "Sejarah", href: "#sejarah" },
                { label: "Visi & Misi", href: "#visi-misi" },
                { label: "Dokumen", href: "#dokumen" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:bg-primary/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </ScrollReveal>

          {/* Stats row */}
          <ScrollReveal>
            <div className="mt-12 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { angka: "1964", label: "Tahun Berdiri" },
                { angka: "500+", label: "Jemaat & Resort" },
                { angka: "60+", label: "Tahun Melayani" },
                { angka: "5", label: "Panca Pelayanan" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-background/35 px-4 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.2)] backdrop-blur-md"
                >
                  <span
                    className="block text-3xl font-bold text-accent md:text-4xl"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {stat.angka}
                  </span>
                  <span className="mt-1 block text-sm text-text-primary/75">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Sejarah GKPI ─────────────────────────────────────────────────── */}
      <section
        id="sejarah"
        className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28"
      >
        <ScrollReveal>
          <div className="max-w-xl mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent mb-3">
              Perjalanan Iman
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold text-text-primary mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Sejarah GKPI
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              Gereja di segala abad dan tempat menghadapi berbagai tantangan.
              Terhadap semua itu gereja harus memberi jawab yang bersumber pada
              Firman Tuhan sebagai satu-satunya sumber ajaran dan norma yang
              benar.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="max-w-3xl">
            {sejarahTimeline.map((item, idx) => (
              <AccordionItem
                key={idx}
                item={item}
                index={idx}
                isOpen={openIndex === idx}
                onToggle={() => handleToggle(idx)}
              />
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── Divider ──────────────────────────────────────────────────────── */}
      <div className="relative h-px max-w-7xl mx-auto px-4">
        <div
          className="h-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, #2A3F57 30%, #6FA8DC50 50%, #2A3F57 70%, transparent)",
          }}
        />
      </div>

      {/* ── Visi & Misi ──────────────────────────────────────────────────── */}
      <section
        id="visi-misi"
        className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28"
      >
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent mb-3">
              Visi & Misi
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold text-text-primary mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Arah Pelayanan GKPI
            </h2>

            {/* Visi Card */}
            <div
              className="relative rounded-3xl p-8 md:p-10 mb-4 overflow-hidden border border-amber-500/20"
              style={{
                background:
                  "linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(26,58,95,0.6) 100%)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div
                className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 blur-2xl pointer-events-none"
                style={{ background: "radial-gradient(circle, #D4AF37, transparent)" }}
              />
              <Star
                size={32}
                className="mx-auto mb-4 text-amber-400 opacity-80"
              />
              <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">
                Visi GKPI 2015–2030
              </p>
              <blockquote
                className="text-2xl md:text-3xl font-bold text-white leading-snug"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                &ldquo;Menjadi Persekutuan Penyembahan dan Persembahan pada
                Tahun 2030&rdquo;
              </blockquote>
            </div>

            <p className="text-text-secondary text-lg leading-relaxed mt-8">
              Dalam rangka mendukung visi tersebut, Misi GKPI dijabarkan dalam{" "}
              <strong className="text-text-primary">Panca Pelayanan GKPI</strong>:
            </p>
          </div>
        </ScrollReveal>

        {/* Misi Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {misiCards.map((item, idx) => (
            <ScrollReveal key={idx}>
              <article
                className={`relative group rounded-3xl p-7 md:p-8 border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl overflow-hidden ${item.border}`}
                style={{
                  background: `linear-gradient(135deg, ${item.warna
                    .replace("from-", "")
                    .replace(" to-", ", ")
                    .replace("/20", "33")}, rgba(22,42,64,0.8))`,
                  backdropFilter: "blur(12px)",
                }}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                  style={{ background: "radial-gradient(ellipse at top left, rgba(111,168,220,0.06), transparent 70%)" }} />

                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 bg-white/5 border ${item.border}`}
                >
                  <item.icon size={26} className={item.aksen} />
                </div>

                <div className="flex items-baseline gap-2 mb-3">
                  <h3
                    className="text-xl font-bold text-text-primary"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {item.nama}
                  </h3>
                  <span className={`text-sm font-medium ${item.aksen}`}>
                    ({item.label})
                  </span>
                </div>
                <p className="text-text-secondary leading-relaxed text-base">
                  {item.deskripsi}
                </p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Motto Pelayanan ───────────────────────────────────────────────── */}
      <section
        className="py-16 px-4 md:px-8"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(26,58,95,0.15) 50%, transparent 100%)",
        }}
      >
        <ScrollReveal>
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-accent mb-10">
              Motto Pelayanan GKPI
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  num: "01",
                  teks: "Yesus Gembala Yang Baik",
                  icon: Heart,
                },
                {
                  num: "02",
                  teks: "Melayani Bukan Untuk Dilayani",
                  icon: HandHeart,
                },
                {
                  num: "03",
                  teks: "Imamat Am Orang Percaya",
                  icon: Church,
                },
                {
                  num: "04",
                  teks: "Membayar Hutang Penginjilan",
                  icon: Megaphone,
                },
              ].map((m) => (
                <div
                  key={m.num}
                  className="group flex items-center gap-4 p-6 rounded-2xl border border-border/60 bg-surface/40 hover:border-accent/30 hover:bg-surface/70 transition-all duration-300 min-h-[72px]"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <m.icon size={18} className="text-accent" />
                  </div>
                  <p className="text-text-primary font-medium leading-tight text-base">
                    {m.teks}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Dokumen & Profil Lengkap ──────────────────────────────────────── */}
      <section
        id="dokumen"
        className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28"
      >
        <ScrollReveal>
          <div className="max-w-xl mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent mb-3">
              Dokumen Resmi
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold text-text-primary mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Dokumen Profil GKPI
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              Akses dokumen resmi dan literatur yang menjadi landasan identitas,
              iman, dan tata kelola Gereja Kristen Protestan Indonesia.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dokumenProfile.map((dok, idx) => (
            <ScrollReveal key={idx}>
              <button
                type="button"
                onClick={() => setSelectedDocIndex(idx)}
                className="w-full text-left group flex flex-col gap-5 p-7 rounded-3xl border border-border/60 bg-surface/50 hover:border-accent/30 hover:bg-surface/80 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 min-h-[200px] cursor-pointer"
                style={{ backdropFilter: "blur(12px)" }}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-border/60 flex items-center justify-center group-hover:bg-accent/10 group-hover:border-accent/20 transition-colors">
                    <dok.icon size={22} className="text-accent" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                    {dok.tag}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">
                    {dok.judul}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {dok.deskripsi}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-accent text-sm font-semibold mt-auto opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                  <span>Lihat selengkapnya</span>
                  <ChevronRight size={16} />
                </div>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Document Details Modal ───────────────────────────────────────── */}
      {selectedDocIndex !== null && (() => {
        const doc = dokumenDetail[selectedDocIndex];
        return (
          <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 md:p-6 animate-fade-in">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-background/85 backdrop-blur-lg cursor-pointer"
              onClick={() => setSelectedDocIndex(null)}
            />

            {/* Modal Body */}
            <div
              className="relative flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-accent/20 shadow-2xl animate-slide-up md:h-[80vh]"
              style={{
                background: "linear-gradient(160deg, rgba(22,42,64,0.98) 0%, rgba(8,17,30,0.98) 100%)",
                boxShadow: "0 28px 90px rgba(0,0,0,0.45), 0 0 50px rgba(111,168,220,0.12)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 md:p-8 border-b border-border/40 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/15 border border-accent/20 flex items-center justify-center">
                    {selectedDocIndex === 0 && <BookOpen className="text-accent" size={22} />}
                    {selectedDocIndex === 1 && <Eye className="text-accent" size={22} />}
                    {selectedDocIndex === 2 && <Music className="text-accent" size={22} />}
                    {selectedDocIndex === 3 && <FileText className="text-accent" size={22} />}
                    {selectedDocIndex === 4 && <Scale className="text-accent" size={22} />}
                    {selectedDocIndex === 5 && <Home className="text-accent" size={22} />}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25">
                      {doc.tag}
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-white mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {doc.judul}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDocIndex(null)}
                  className="w-10 h-10 rounded-full border border-border/60 flex items-center justify-center text-text-secondary hover:text-white hover:border-white transition-all bg-surface/30 cursor-pointer"
                  aria-label="Tutup"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Scroll Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 no-scrollbar">
                {/* 1. SEJARAH / VISI-MISI (Multi Section Tabbed Layout) */}
                {doc.sections && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                    {/* Sidebar Tabs */}
                    <div className="md:col-span-1 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 border-b md:border-b-0 md:border-r border-border/20 shrink-0">
                      {doc.sections.map((sec, sidx) => (
                        <button
                          key={sidx}
                          onClick={() => setActiveTab(sidx)}
                          className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap md:whitespace-normal cursor-pointer
                            ${activeTab === sidx
                              ? "bg-accent/15 text-accent border-l-2 border-accent"
                              : "text-text-secondary hover:text-text-primary hover:bg-surface/30"}`}
                        >
                          {sec.title}
                        </button>
                      ))}
                    </div>

                    {/* Section Content */}
                    <div className="md:col-span-3 space-y-4">
                      <h4 className="text-lg font-bold text-white mb-2 pb-1 border-b border-border/20" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {doc.sections[activeTab].title}
                      </h4>
                      <div className="text-text-secondary leading-relaxed space-y-4 text-base md:text-lg">
                        {doc.sections[activeTab].content.split("\n\n").map((para, pidx) => {
                          if (para.startsWith("- ") || para.startsWith("1. ")) {
                            return (
                              <div key={pidx} className="pl-4 space-y-2">
                                {para.split("\n").map((li, lidx) => (
                                  <p key={lidx} className="relative pl-5">
                                    <span className="absolute left-0 text-accent">•</span>
                                    {li.replace(/^[-\d\.\s]+/, "")}
                                  </p>
                                ))}
                              </div>
                            );
                          }
                          return (
                            <p key={pidx}>
                              {para.split("**").map((chunk, cidx) =>
                                cidx % 2 === 1 ? <strong key={cidx} className="text-text-primary font-semibold">{chunk}</strong> : chunk
                              )}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. MARS GKPI PLAYER & LYRICS */}
                {doc.isMars && (
                  <div className="max-w-2xl mx-auto space-y-8 pb-8">
                    {/* Beautiful Audio Player Card */}
                    <div className="p-6 rounded-3xl border border-accent/20 bg-surface/40 flex flex-col md:flex-row items-center gap-6"
                         style={{ background: "linear-gradient(135deg, rgba(111,168,220,0.08) 0%, rgba(22,42,64,0.4) 100%)" }}>
                      <audio
                        ref={audioRef}
                        src="https://gkpisinode.org/wp-content/plugins/gkpi-library/music/music.mp3"
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleAudioLoaded}
                        onEnded={handleAudioEnded}
                      />

                      <button
                        onClick={togglePlay}
                        className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-background hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent/20 shrink-0 cursor-pointer"
                      >
                        {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} className="translate-x-0.5" fill="currentColor" />}
                      </button>

                      <div className="flex-1 w-full space-y-2">
                        <div className="flex items-center justify-between text-xs text-text-secondary">
                          <span>{formatTime(audioProgress)}</span>
                          <span>{formatTime(audioDuration)}</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={audioDuration || 100}
                          value={audioProgress}
                          onChange={handleProgressChange}
                          className="w-full h-1.5 rounded-lg bg-border/40 accent-accent cursor-pointer"
                        />
                        <div className="flex items-center justify-between pt-2">
                          <p className="text-sm font-semibold text-white">Mars GKPI Audio</p>
                          <div className="flex items-center gap-3">
                            <button onClick={() => setIsMuted(!isMuted)} className="text-text-secondary hover:text-white cursor-pointer">
                              {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                            </button>
                            <input
                              type="range"
                              min={0}
                              max={1}
                              step={0.05}
                              value={isMuted ? 0 : volume}
                              onChange={(e) => {
                                setVolume(parseFloat(e.target.value));
                                setIsMuted(false);
                              }}
                              className="w-16 h-1 accent-accent cursor-pointer"
                            />
                            <a
                              href="https://gkpisinode.org/wp-content/uploads/2021/09/MARS-GKPI-Revisi-3-1.pdf"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-accent hover:underline font-semibold pl-2 cursor-pointer"
                            >
                              <Download size={14} />
                              PDF
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Lyrics Display */}
                    <div className="text-center space-y-6">
                      <h4 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Lirik Mars GKPI
                      </h4>
                      <div className="text-text-secondary leading-loose text-base md:text-lg italic space-y-6 bg-surface/20 p-6 md:p-8 rounded-2xl border border-border/40">
                        {doc.lyrics.split("\n\n").map((stanza, idx) => (
                          <p key={idx} className="whitespace-pre-line">
                            {stanza.replace(/\*\*/g, "")}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. TATA GEREJA (Mukadimah & Interactive Accordion Articles) */}
                {doc.isArticles && (
                  <div className="space-y-6">
                    {/* Mukadimah Card */}
                    <div className="p-6 md:p-8 rounded-2xl border border-border/40 bg-surface/20">
                      <h4 className="text-lg font-bold text-white mb-4 uppercase tracking-widest text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Mukadimah
                      </h4>
                      <div className="text-text-secondary leading-relaxed text-sm md:text-base space-y-4">
                        {doc.mukadimah.split("\n\n").map((para, idx) => (
                          <p key={idx}>{para}</p>
                        ))}
                      </div>
                    </div>

                    {/* Articles List */}
                    <div className="space-y-3">
                      <h4 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Pasal-Pasal Tata Gereja
                      </h4>
                      {doc.articles.map((art, idx) => {
                        const isArtOpen = activeTab === idx;
                        return (
                          <div
                            key={idx}
                            className={`rounded-2xl border transition-all duration-300 overflow-hidden
                              ${isArtOpen ? "border-accent/30 bg-surface/60" : "border-border/40 bg-surface/25 hover:border-border/80"}`}
                          >
                            <button
                              onClick={() => setActiveTab(isArtOpen ? -1 : idx)}
                              className="w-full text-left p-5 flex items-center justify-between cursor-pointer"
                            >
                              <div className="flex items-center gap-4">
                                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-accent/15 text-accent">
                                  {art.pasal}
                                </span>
                                <h5 className="font-serif font-bold text-white text-base md:text-lg">
                                  {art.judul}
                                </h5>
                              </div>
                              <ChevronDown
                                size={18}
                                className={`text-text-secondary transition-transform duration-300 ${isArtOpen ? "rotate-180 text-accent" : ""}`}
                              />
                            </button>
                            {isArtOpen && (
                              <div className="px-5 pb-5 pt-1 border-t border-border/10">
                                <p className="text-text-secondary leading-relaxed whitespace-pre-line text-sm md:text-base">
                                  {art.isi}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. PERATURAN RUMAH TANGGA (Interactive Accordion Chapters) */}
                {doc.isPRT && (
                  <div className="space-y-6">
                    <p className="text-text-secondary leading-relaxed text-base">
                      Peraturan Rumah Tangga (PRT) GKPI merupakan pedoman operasional dan tata laksana bagi pelayan, pengurus, serta jemaat di semua tingkatan kepengurusan.
                    </p>
                    <div className="space-y-3">
                      {doc.chapters.map((chap, idx) => {
                        const isChapOpen = activeTab === idx;
                        return (
                          <div
                            key={idx}
                            className={`rounded-2xl border transition-all duration-300 overflow-hidden
                              ${isChapOpen ? "border-accent/30 bg-surface/60" : "border-border/40 bg-surface/25 hover:border-border/80"}`}
                          >
                            <button
                              onClick={() => setActiveTab(isChapOpen ? -1 : idx)}
                              className="w-full text-left p-5 flex items-center justify-between cursor-pointer"
                            >
                              <div className="flex items-center gap-4">
                                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-accent/15 text-accent">
                                  {chap.bab}
                                </span>
                                <h5 className="font-serif font-bold text-white text-base md:text-lg">
                                  {chap.judul}
                                </h5>
                              </div>
                              <ChevronDown
                                size={18}
                                className={`text-text-secondary transition-transform duration-300 ${isChapOpen ? "rotate-180 text-accent" : ""}`}
                              />
                            </button>
                            {isChapOpen && (
                              <div className="px-5 pb-5 pt-1 border-t border-border/10">
                                <p className="text-text-secondary leading-relaxed whitespace-pre-line text-sm md:text-base">
                                  {chap.isi.split("\n\n").map((para, pidx) => (
                                    <span key={pidx} className="block mb-3 last:mb-0">
                                      {para.startsWith("**") ? (
                                        <strong className="text-text-primary block font-semibold mb-1">
                                          {para.replace(/\*\*/g, "")}
                                        </strong>
                                      ) : para}
                                    </span>
                                  ))}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 5. PENGAKUAN IMAN */}
                {doc.isConfession && (
                  <div className="space-y-8">
                    {/* Intro & Declaration */}
                    <div className="p-6 md:p-8 rounded-2xl border border-border/40 bg-surface/20 space-y-4">
                      <p className="text-text-secondary text-sm md:text-base leading-relaxed">
                        {doc.pengantar}
                      </p>
                      <blockquote className="border-l-4 border-accent pl-4 py-1.5 italic text-white font-medium text-base md:text-lg leading-relaxed bg-accent/5 pr-4 rounded-r-lg">
                        {doc.isiConfession}
                      </blockquote>
                    </div>

                    {/* Points Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {doc.points.map((pt, idx) => (
                        <div key={idx} className="p-6 rounded-2xl border border-border/60 bg-surface/20 space-y-2">
                          <h5 className="text-white font-bold font-serif text-lg">
                            {pt.title}
                          </h5>
                          <p className="text-text-secondary leading-relaxed text-sm md:text-base">
                            {pt.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto mb-16">
        <ScrollReveal>
          <div
            className="relative rounded-[2rem] p-10 md:p-14 overflow-hidden border border-border/40"
            style={{
              background:
                "linear-gradient(135deg, rgba(26,58,95,0.8) 0%, rgba(15,32,39,0.95) 100%)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Decorative glow */}
            <div
              className="absolute top-[-30%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-15 blur-3xl pointer-events-none"
              style={{ background: "radial-gradient(circle, #6FA8DC, transparent)" }}
            />
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent mb-3">
                  Bergabunglah dengan Kami
                </p>
                <h2
                  className="text-3xl md:text-4xl font-bold text-white mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Temukan Jemaat GKPI Terdekat
                </h2>
                <p className="text-text-secondary text-lg max-w-xl leading-relaxed">
                  GKPI hadir di berbagai wilayah Indonesia. Temukan resort atau
                  jemaat terdekat dan mulailah perjalanan iman bersama kami.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                <Link
                  href="/wilayah-resort"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-background text-sm font-bold rounded-2xl hover:bg-accent/90 shadow-lg shadow-accent/20 transition-all duration-300 whitespace-nowrap"
                  style={{ backgroundColor: "#6FA8DC" }}
                >
                  <span>Cari Jemaat</span>
                  <ChevronRight size={18} />
                </Link>
                <Link
                  href="/pengurus"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-surface/80 text-text-primary text-sm font-bold rounded-2xl border border-border hover:border-accent/30 hover:bg-surface transition-all duration-300 whitespace-nowrap"
                >
                  <span>Struktur Pengurus</span>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </main>
  );
}
