<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Ambil data dari request
$data = json_decode(file_get_contents("php://input"), true);

// Pastikan data ada sebelum diproses          
if (!isset($data['total']) || !isset($data['items']) || !isset($data['name']) || !isset($data['email']) || !isset($data['phone'])) {
    echo json_encode(['error' => 'Data tidak lengkap']);
    exit;
}

// Proses transaksi
$total = $data['total'];
$items = json_decode($data['items'], true); // Konversi kembali dari JSON

// Kode untuk memproses Midtrans...
require_once 'midtrans-php-master/Midtrans.php';

// Load environment variables
$serverKey = getenv('MIDTRANS_SERVER_KEY');
$isProduction = getenv('MIDTRANS_IS_PRODUCTION') === 'true';
$isSanitized = getenv('MIDTRANS_IS_SANITIZED') === 'true';
$is3ds = getenv('MIDTRANS_IS_3DS') === 'true';

// Set konfigurasi Midtrans
\Midtrans\Config::$serverKey = $serverKey;
\Midtrans\Config::$isProduction = $isProduction;
\Midtrans\Config::$isSanitized = $isSanitized;
\Midtrans\Config::$is3ds = $is3ds;

// Detail transaksi
$transaction_details = array(
    'order_id' => rand(),
    'gross_amount' => (int)$data['total'],
);

$params = array(
    'transaction_details' => $transaction_details,
    'customer_details' => array(
        'first_name' => $data['name'],
        'email' => $data['email'],
        'phone' => $data['phone'],
    ),
    'item_details' => $items,
);

try {
    $snapToken = \Midtrans\Snap::getSnapToken($params);
    echo json_encode(['token' => $snapToken]); // Mengembalikan token sebagai JSON
} catch (Exception $e) {
    echo json_encode(['error' => 'Error: ' . $e->getMessage()]); // Mengembalikan error sebagai JSON
}
?>
