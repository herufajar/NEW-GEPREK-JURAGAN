document.addEventListener('alpine:init', () => {
Alpine.data('products', () => ({
    items: [
        { id: 1, name: 'Ayam Geprek Bakar Hot', img: '1.jpg', price: 15000 },
        { id: 2, name: 'Ayam Geprek Sambal Bawang', img: '2.jpg', price: 10000 },
        { id: 3, name: 'Ayam Geprek Mozarella', img: '3.jpg', price: 15000 },
        { id: 4, name: 'Ayam Geprek Sambal Matah', img: '4.jpg', price: 13000 },
        { id: 5, name: 'Ayam Geprek Samabal Ijo', img: '5.jpg', price: 12000 },
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
        // cek apakah ada barang yang sama di cart
        const cartItem = this.items.find((item) => item.id === newItem.id);

        // jika belum ada / cart masih kosong
        if(!cartItem) {
            this.items.push({...newItem, quantity: 1, total: newItem.price});
            this.quantity++;
            this.total += newItem.price;
        } else {
            // jika barangnya sudah ada, cek apakah barang beda atau sama dengan yang ada di cart
            this.items = this.items.map((item) => {
            // jika barang berbeda
            if(item.id !== newItem.id) {
                return item;
            } else {
                // jika barang sudah ada, maka tambah quantity dan totalnya
                item.quantity++;
                item.total = item.price * item.quantity;
                this.quantity++;
                this.total += item.price;
                return item;
            }
            })
        }
    },
    remove(id) {
        // ambil item yang mau di remove berdasarkan id nya
        const cartItem = this.items.find((item) => item.id === id);

        // jika item lebih dari 1
        if(cartItem.quantity > 1) {
        // telusuri satu satu
        this.items = this.items.map((item) => {
        // jika bukan barang yang di klik
        if(item.id !== id) {
            return item;
        } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
        }
        })
        } else if (cartItem.quantity === 1) {
            // jia barangnya sisa 1
            this.items = this.items.filter((item) => item.id !== id);
            this.quantity--;
            this.total -= cartItem.price;
        }
    },
});
});


// Konversi ke Rupiah
const rupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};