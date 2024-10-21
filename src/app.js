document.addEventListener('alpine:init', () => {
    Alpine.data('products', () => ({
        items: [
            { id: 1, name: 'Ayam Geprek Bakar Hot', img: '1.jpg', price: 15000 },
            { id: 2, name: 'Ayam Geprek Sambal Bawang', img: '2.jpg', price: 10000 },
            { id: 3, name: 'Ayam Geprek Mozarella', img: '3.jpg', price: 15000 },
            { id: 4, name: 'Ayam Geprek Sambal Matah', img: '4.jpg', price: 13000 },
            { id: 5, name: 'Ayam Geprek Sambal Ijo', img: '5.jpg', price: 12000 },
            { id: 6, name: 'Crispy Chicken Skin Rice', img: '6.jpg', price: 10000 },
            { id: 7, name: 'Crispy Chicken Skin', img: '7.jpg', price: 7000 },
            { id: 8, name: 'Es Teh Juragan', img: '8.jpg', price: 3000 },
            { id: 9, name: 'Es Teh Lemon Juragan', img: '9.jpg', price: 5000 },
        ],
    }));

    Alpine.store('cart', {
        items: [],
        total: 0,
        quantity: 0,
        add(newItem) {
            const cartItem = this.items.find((item) => item.id === newItem.id);
            if (!cartItem) {
                this.items.push({ ...newItem, quantity: 1, total: newItem.price });
                this.quantity++;
                this.total += newItem.price;
            } else {
                this.items = this.items.map((item) => {
                    if (item.id !== newItem.id) return item;
                    item.quantity++;
                    item.total = item.price * item.quantity;
                    this.quantity++;
                    this.total += item.price;
                    return item;
                });
            }
        },
        remove(id) {
            const cartItem = this.items.find((item) => item.id === id);
            if (cartItem.quantity > 1) {
                this.items = this.items.map((item) => {
                    if (item.id !== id) return item;
                    item.quantity--;
                    item.total = item.price * item.quantity;
                    this.quantity--;
                    this.total -= item.price;
                    return item;
                });
            } else {
                this.items = this.items.filter((item) => item.id !== id);
                this.quantity--;
                this.total -= cartItem.price;
            }
        },
    });
});

// Form Validation
const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true;

const form = document.querySelector('#checkoutForm');
form.addEventListener('keyup', function () {
    let isValid = true;
    for (let i = 0; i < form.elements.length; i++) {
        if (form.elements[i].value.length === 0) {
            isValid = false;
            break;
        }
    }
    checkoutButton.disabled = !isValid;
    if (isValid) {
        checkoutButton.classList.remove('disabled');
    } else {
        checkoutButton.classList.add('disabled');
    }
});

// Kirim data ketika tombol checkout diklik
checkoutButton.addEventListener('click', async function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const objData = Object.fromEntries(data);

    // Tambahkan properti yang diperlukan
    objData.total = Alpine.store('cart').total; // Ambil total dari cart
    objData.items = JSON.stringify(Alpine.store('cart').items); // Konversi items ke JSON string

    // Kirim data yang sudah lengkap
    try {
        const response = await fetch('http://localhost:8080/GEPREK-JURAGAN-WEBSITE/php/placeOrder.php', {
            method: 'POST',
            body: JSON.stringify(objData),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Cek apakah respons dari server ok
        if (!response.ok) {
            const errorText = await response.text(); // Ambil respons dalam bentuk teks
            console.error('Error from server:', errorText);
            throw new Error('Network response was not ok');
        }

        // Tambahkan logging untuk melihat respons
        const responseText = await response.text(); // Ambil respons dalam bentuk teks
        console.log('Response from server:', responseText); // Tampilkan di konsol

        const tokenResponse = JSON.parse(responseText); // Parse ke JSON
        if (tokenResponse.error) {
            console.error('Error from placeOrder:', tokenResponse.error);
            return; // Menghentikan eksekusi jika ada error
        }

        const token = tokenResponse.token; // Ambil token dari respons
        console.log('Token:', token); // Periksa token di console

        // Cek apakah window.snap sudah terdefinisi
        if (window.snap) {
            window.snap.pay(token); // Memanggil fungsi pay dari Snap
        } else {
            console.error('Midtrans Snap not loaded. Please check your script inclusion.');
        }
    } catch (err) {
        console.error('Error during fetch:', err.message); // Menampilkan error ke console
    }
});


// Format pesan WhatsApp
const formatMessage = (obj) => {
    return `Data Customer
        Nama: ${obj.name}
        Email: ${obj.email}
        Phone: ${obj.phone}
Data Pesanan:
        ${JSON.parse(obj.items)
            .map((item) => `${item.name} (${item.quantity} x ${rupiah(item.total)})`)
            .join('\n')}
TOTAL: ${rupiah(obj.total)}
Terima kasih.`;
};

// Konversi ke Rupiah
const rupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

