<?php
// Mengizinkan akses CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Tangani permintaan OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Memuat autoload dari Composer
require_once __DIR__ . '/../vendor/autoload.php'; // Pastikan path ini benar

// Memuat file .env
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../'); // Pastikan path ini mengarah ke direktori yang berisi .env
$dotenv->load();

// Ambil kunci dari .env
$serverKey = $_ENV['MIDTRANS_SERVER_KEY'];
$clientKey = $_ENV['MIDTRANS_CLIENT_KEY'];

// Tambahkan logging untuk memeriksa kunci
error_log("Server Key: " . $serverKey);
error_log("Client Key: " . $clientKey);

// Pastikan kunci ada
if (!$serverKey || !$clientKey) {
    echo json_encode(['error' => 'Server key or client key is not set.']);
    exit;
}

// Ambil data dari request
$data = json_decode(file_get_contents("php://input"), true);

// Debugging: Tampilkan isi dari $data untuk memeriksa
if ($data === null) {
    echo json_encode(['error' => 'Invalid JSON data.']);
    exit;
}

// Pastikan data ada sebelum diproses          
if (!isset($data['total'], $data['items'], $data['name'], $data['email'], $data['phone'])) {
    echo json_encode(['error' => 'Data tidak lengkap']);
    exit;
}

// Proses transaksi
$total = $data['total'];
$items = json_decode($data['items'], true); // Konversi kembali dari JSON

// Validasi items
if (!is_array($items) || empty($items)) {
    echo json_encode(['error' => 'Item details are invalid.']);
    exit;
}

// Validasi total
if (!is_numeric($total) || $total <= 0) {
    echo json_encode(['error' => 'Invalid total amount']);
    exit;
}

// Kode untuk memproses Midtrans...
require_once 'midtrans-php-master/Midtrans.php';

// Set konfigurasi Midtrans
\Midtrans\Config::$serverKey = $serverKey;
\Midtrans\Config::$isProduction = (bool)getenv('MIDTRANS_IS_PRODUCTION');
\Midtrans\Config::$isSanitized = (bool)getenv('MIDTRANS_IS_SANITIZED');
\Midtrans\Config::$is3ds = (bool)getenv('MIDTRANS_IS_3DS');

// Detail transaksi
$order_id = 'ORD-' . uniqid(); // Tambahkan prefiks untuk lebih unik
$transaction_details = array(
    'order_id' => $order_id, // Menggunakan uniqid() untuk order_id yang unik
    'gross_amount' => (int)$total,
);

// Persiapan parameter untuk transaksi
$params = array(
    'transaction_details' => $transaction_details,
    'customer_details' => array(
        'first_name' => $data['name'],
        'email' => $data['email'],
        'phone' => $data['phone'],
    ),
    'item_details' => $items,
);

// Proses mendapatkan Snap Token
try {
    $snapToken = \Midtrans\Snap::getSnapToken($params);
    echo json_encode(['token' => $snapToken, 'order_id' => $order_id]); // Mengembalikan token dan order_id sebagai JSON
} catch (Exception $e) {
    error_log('Error during Midtrans transaction: ' . $e->getMessage()); // Logging untuk debugging
    echo json_encode(['error' => 'Error: ' . $e->getMessage()]); // Mengembalikan error sebagai JSON
}
?>
