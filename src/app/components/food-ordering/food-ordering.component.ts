import { Component, OnInit, ViewEncapsulation,Input } from '@angular/core';
import { OrderingService, ApiService } from 'src/app/services';
import { User } from 'src/app/models';
import { Router, ActivatedRoute } from '@angular/router';
import { getItem, setItem } from 'src/app/utils/storage';
import { FileUploader } from 'ng2-file-upload';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-food-ordering',
  templateUrl: './food-ordering.component.html',
  styleUrls: ['./food-ordering.component.scss'],
  providers: [NgbModalConfig, NgbModal],
  encapsulation: ViewEncapsulation.None,
})
export class FoodOrderingComponent implements OnInit {
 
  user = new User();
  showAptInput = false;
  showNumberOfPeopleInput = false;
  uploader: FileUploader;
  email:any;
  restaurants = [];
  filteredRestaurants = [];
  selectedRestaurant: any;
  menu: any;
  cart = {
    cart_id: 0,
    user_id: 0,
    restaurant_id: 0,
    cart_qty: 0,
    cart_subtotal: 0,
    cart_tax: 0,
    cart_service_fee: 0,
    cart_delivery_fee: 0,
    cart_total: 0,
    items: []
  }
  qty = 1;
  isAddQtyShown = false;
  previousItemId = undefined;
  options = [];
  deluxeItem = undefined;
  checkoutText: string;
  selectedService: string;

  order: any;
  thankyouSection = false;

  locationSection = false;
  servicesSection = false;
  restaurantsSection = false;
  menuSection = false;
  checkoutSection = false;
  showSpinner = false;

   hash: string;
   toggle: boolean;
   data:any;
   message:string;

  constructor(
    private orderingService: OrderingService,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private config: NgbModalConfig, 
    private modalService: NgbModal,
    private notification:ToastrService
    ) { 
      this.uploader = new FileUploader({
        url: `https://api.paranoidfan.com/api/sdk/upload`,
        isHTML5: true,
        headers: [{
            name: 'Authkey',
            value: 'ret4e54Zi-KJdy-T7gP99'
        }]
      });

      // customize default values of modals used by this component tree
      this.config.backdrop = 'static';
      this.config.keyboard = false;
    }

  ngOnInit() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--ecommerceBtnTextColor', `indigo`);

    this.verifyUser();
    this.hash = this.route.snapshot.params['hash'];

    if (getItem(`cart-${this.user.userid}`)) {
      this.cart = getItem(`cart-${this.user.userid}`)
    } else if (getItem(`cart-0`)) {
      this.cart = getItem(`cart-0`)
      if(this.user.userid != '0') {
        setItem(`cart-${this.user.userid}`, this.cart)
        this.selectedRestaurant = getItem('selectedRestaurant')
        this.updateCart();
      }
    }

    switch (this.hash) {
      case 'services':
        this.onGotoServices(this.user);
        break;
      case 'restaurants':
        this.onGoToRestaurants();
        break;
      case 'menu':
        this.onGotoMenu();
        break;
      case 'checkout':
        this.onGoToCheckout();
        break;
      default:
        this.setView('locationSection');
        this.emptyCart(false);
    }
  }

  setView(name) {
    this.locationSection = false;
    this.servicesSection = false;
    this.restaurantsSection = false;
    this.menuSection = false;
    this.checkoutSection = false;
    this.thankyouSection = false;
    if (this[name] !== undefined) {
      this[name] = true;
      this.hash = name.replace('Section', '')
      setItem('hash', this.hash)
      if (this.locationSection) {
        // clear things on localStorage
        setItem('restaurants', [])
        setItem('selectedRestaurant', {})
        setItem('selectedService', '')
        setItem(`cart-${this.user.userid}`, {})
      }
      this.router.navigate([`${this.hash}`]);
    }
  }

  verifyUser() {
    console.log('verifyUser()')
    if (getItem('user')) {
      this.user = getItem('user')
      this.getRestaurantsByZipCode(); 
    } 
  }

  getRestaurantsByZipCode() {
    if (this.user.location_zipcode) {
      this.showSpinner = true;
      this.orderingService.get(`restaurants/${this.user.location_zipcode}`)
        .subscribe(res => {
          this.showSpinner = false;
          console.log(res)
          if (res && !res.err && res.response && res.response.length > 0) {
            this.restaurants = res.response;
            setItem('restaurants', this.restaurants)
            this.options = Array.from(new Set(this.restaurants.map(restaurant => restaurant.tnx_options)))
            console.log(this.options)
          } else {
            this.restaurants = []
            this.options = []
          }
        })
    }
  }

  onGotoServices(user) {
    this.user = user;
    if (user.location) {
      this.setView('servicesSection')
      this.getRestaurantsByZipCode();
    } else {
      this.setView('locationSection')
    }
  }

  onSaveApt() {
    this.updateLocation()
    this.showAptInput = false;
  }

  onChangePeopleInFamily() {
    this.showNumberOfPeopleInput = false;
    this.apiService.post(`/user/peopleInFamily`, this.user)
        .subscribe(res => {
          console.log(res)
          setItem('user', this.user)
        })
  }

  updateLocation() {
    if (this.user.userid != 0) {
      this.apiService.post(`/user/location`, this.user)
        .subscribe(res => {
          console.log(res)
        })
    }
    setItem('user', this.user)
  }

  onServiceSelection(service) {
    this.selectedService = service
    setItem('selectedService', service)
    this.filteredRestaurants = this.restaurants.filter(restaurant => restaurant.tnx_options === service || restaurant.tnx_options === 'BOTH')
    this.setView('restaurantsSection')
  }

  onGoToRestaurants() {
    if (this.restaurants || getItem('restaurants')) {
      this.selectedService = !this.selectedService ? getItem('selectedService') : this.selectedService
      this.restaurants = this.restaurants.length === 0 ? getItem('restaurants') : this.restaurants
      this.onServiceSelection(this.selectedService)
    }
  }

  /* *************************** Menu UI ***************************************************/
  onGotoMenu() {
    if (this.selectedRestaurant || getItem('selectedRestaurant')) {
      this.selectedRestaurant = this.selectedRestaurant ? this.selectedRestaurant : getItem('selectedRestaurant')
      this.getCart();
      this.menu = this.selectedRestaurant.menus[0];
      this.setView('menuSection')
    }
  }

  onSelectRestaurant(restaurant) {
    this.showSpinner = true;
    this.orderingService.get(`getRestaurantDetail/${restaurant.id}`)
      .subscribe(res => {
        this.showSpinner = false;
        console.log(res)
        if (res && res.length > 0) {
          this.selectedRestaurant = { ...restaurant, ...res[0] };
          setItem('selectedRestaurant', this.selectedRestaurant)
          this.getCart();
          this.menu = this.selectedRestaurant.menus[0];
          // console.log(this.menu);
          this.setView('menuSection')
          setTimeout(() => this.updateStyleOnMobile(), 100);
        }
      })
  }

  emptyCart(updateCart) {
    // console.log('emptyCart')
    const cart = {
      cart_id: (this.cart && this.cart.cart_id) ? this.cart.cart_id : 0,
      user_id: this.user.userid,
      restaurant_id: (this.selectedRestaurant && this.selectedRestaurant.id) || 0,
      cart_qty: 0,
      cart_subtotal: 0,
      cart_tax: 0,
      cart_service_fee: 0,
      cart_delivery_fee: 0,
      cart_total: 0,
      items: []
    };
    this.cart = cart;
    this.checkoutText = 'Keep Browsing';

    // console.log('cart after calling emptyCart()')
    // console.log(this.cart)

    // update cart in DB
    if (updateCart) {
      this.updateCart();
    }
  }

  getCart() {
    if (this.user.userid != 0) {
      this.orderingService.get(`cart/${this.user.userid}`)
        .subscribe(res => {
          if (!res.err) {
            const carts = res.response;
            let hasCartBeenUpdated = false;
            carts.forEach(cart => {
              if (cart.restaurant_id === this.selectedRestaurant.id) {
                this.cart = cart;
                hasCartBeenUpdated = true;
              }
            });
            if (!hasCartBeenUpdated) {
              this.emptyCart(false);
            }
          }
        });
    } else if (getItem('cart-0')) {
      // update cart with info from cache
      const cart = getItem('cart-0');
      console.log(this.selectedRestaurant.id)
      if (cart.restaurant_id === this.selectedRestaurant.id) {
        this.cart = cart;
      } else {
        this.emptyCart(false);
      }
    }
  }

  updateCart() {
    if (this.selectedRestaurant) {
      if (this.user.userid != 0) {
        const data = {
          user_id: this.user.user_id,
          cart_qty: this.cart.cart_qty,
          cart_subtotal: this.cart.cart_subtotal,
          cart_service_fee: this.cart.cart_service_fee,
          cart_delivery_fee: this.cart.cart_delivery_fee,
          cart_tax: this.cart.cart_tax,
          cart_total: this.cart.cart_total,
          restaurant_id: this.selectedRestaurant.id,
          items: this.cart.items && this.cart.items.length !== 0 ? JSON.stringify(this.cart.items) : '{}'
        };

        console.log('update cart ')
        console.log(data)
        this.orderingService.post(`cart/update`, data)
          .subscribe(res => {
            if (res && !res.err) {
              // console.log(res);
              setItem('cart-' + this.user.userid, this.cart);
            }
          });

      } else {
        setItem('cart-' + this.user.userid, this.cart);
      }
    }
  }

  updateCartTotalAndFees() {
    this.cart.restaurant_id = this.selectedRestaurant.id;
    this.cart.cart_service_fee = this.round(this.cart.cart_subtotal * this.selectedRestaurant.booking_fee / 100);
    this.cart.cart_delivery_fee = this.round(this.cart.cart_subtotal * this.selectedRestaurant.delivery_fee / 100);
    if (this.cart.cart_delivery_fee > 0 && (this.cart.cart_service_fee + this.cart.cart_delivery_fee) < 1) {
      this.cart.cart_service_fee = 0.5;
      this.cart.cart_delivery_fee = 0.5;
    }
    this.cart.cart_total = this.round(this.cart.cart_subtotal + this.cart.cart_tax + this.cart.cart_service_fee + this.cart.cart_delivery_fee);
  }

  increaseQty() {
    this.qty += 1;
  }

  decreaseQty() {
    if (this.qty > 1) {
      this.qty -= 1;
    }
  }

  onOpenAddQty(itemId) {
    if ((this.previousItemId === itemId && !this.isAddQtyShown) || this.previousItemId !== itemId) {
      this.previousItemId = itemId;
      const id = 'cart' + itemId;
      this.qty = 1;
      // $('.add-to-cart-wrapper').hide();
      $('.add-to-cart-wrapper').attr('style', 'display: none !important');
      $('#' + id).attr('style', 'display: flex !important');
      // $('#' + id).css('display', 'flex');
      this.isAddQtyShown = true;
    } else {
      this.onCloseAddQty();
      this.isAddQtyShown = false;
    }
  }

  onCloseAddQty() {
    this.qty = 1;
    // $('.add-to-cart-wrapper').hide();
    $('.add-to-cart-wrapper').attr('style', 'display: none !important');
  }

  onAddItemToCart(item) {

    // $('.add-to-cart-wrapper').hide();
    $('.add-to-cart-wrapper').attr('style', 'display: none !important');
    this.cart.cart_qty += this.qty;
    this.cart.cart_subtotal += item.price * this.qty;
    this.cart.cart_tax += item.tax * this.qty;
    this.updateCartTotalAndFees();
    const savedItem = this.cart.items.filter(i => i.id == item.id);

    if (savedItem.length === 1) {
      // console.log('saved item ');
      // note: keep only item_qty, rest will be deprecated
      savedItem[0].item_qty += this.qty;
      savedItem[0].qty = savedItem[0].item_qty;
      savedItem[0].amounts = savedItem[0].item_qty;

      // remove saved Item
      this.cart.items = this.cart.items.filter(i => i.id != item.id);
      // add saved item with new qty
      this.cart.items.push(savedItem[0]);
    } else {
      // console.log('new item ');
      // note: keep only item_qty, rest will be deprecated
      item.qty = this.qty;
      item.item_qty = this.qty;
      item.amounts = this.qty;
      this.cart.items.push(item);
    }
   // console.log(this.cart);

    // update cart in DB
    this.updateCart();

    this.qty = 1;
  }

  round(value) {
    return parseFloat((Math.round(value * 100) / 100).toFixed(2));
  }
  /* *************************** Cart UI ***************************************************/

  onGoToCheckout() {
    this.cart = this.cart ? this.cart : getItem(`cart-${this.user.userid}`)
    this.selectedRestaurant = this.selectedRestaurant ? this.selectedRestaurant : getItem('selectedRestaurant')
    this.checkoutText = 'Submit Order';
    if (!this.user.driver_licence && this.selectedRestaurant.DL_is_required === 'Yes') {
      this.checkoutText = 'Add Driver Licence';
    }
    this.setView('checkoutSection')
    setTimeout(() => this.updateStyleOnMobile(), 100);
  }

  onRemoveItem(item) {
    const itemToRemove = this.cart.items.filter(i => i.id == item.id)[0];
    this.cart.cart_subtotal -= itemToRemove.price * itemToRemove.item_qty;
    this.cart.cart_tax -= itemToRemove.tax * itemToRemove.item_qty;
    this.cart.cart_qty -= itemToRemove.item_qty;
    // console.log('cart after removing one item')
    // console.log(this.cart)

    if (this.cart.cart_qty === 0) {
      $('.btn-checkout').show();
      this.checkoutText = 'Keep Browsing';
      this.emptyCart(true);
    } else {
      this.updateCartTotalAndFees();

      // remove item from cart
      this.cart.items = this.cart.items.filter(i => i.id != item.id);
      // console.log('cart after removing one item')
      // console.log(this.cart)

      // update cart in DB
      this.updateCart();
    }
  }

  updateQty(operation, item) {
    let update = false;
    if (operation === '+') {
      this.cart.items.forEach(i => {
        if (i.id == item.id) {
          update = true;
          i.item_qty = item.item_qty + 1;
          i.qty = i.item_qty;
          i.amounts = i.item_qty;
          this.cart.cart_qty++;
          this.cart.cart_subtotal += item.price;
          this.cart.cart_tax += item.tax;
        }
      });

    } else {
      if (item.item_qty > 1) {
        this.cart.items.forEach(i => {
          if (i.id == item.id) {
            update = true;
            i.item_qty = item.item_qty - 1;
            i.qty = i.item_qty;
            i.amounts = i.item_qty;
            this.cart.cart_qty--;
            this.cart.cart_subtotal -= item.price;
            this.cart.cart_tax -= item.tax;
          }
        });
      }
    }

    if (update) {
      this.updateCartTotalAndFees();

      // update cart in DB
      this.updateCart();
    }

  }

  updateStyleOnMobile() {
    if ((navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/Android/i))) {
      // For mobile only
      let btnHeight = 50;
      const headerHeight = 60;
      const newInnerHeight = document.getElementById('food-ordering').offsetHeight;
      console.log(newInnerHeight)
      if (this.menuSection) {
        const restaurantImgHeight = document.getElementById('concession-photo').offsetHeight;
        const menuHeight = (newInnerHeight - restaurantImgHeight - headerHeight) + 'px';
        console.log(menuHeight)
        $('.menu-wrapper').css('max-height', menuHeight);
      } else if (this.checkoutSection) {
        const checkoutHeight = (newInnerHeight - btnHeight - headerHeight) + 'px';
        $('.checkout-wrapper').css('max-height', checkoutHeight);
      }
    }
  }

  updateUser() {
    this.orderingService.post('customer', this.user)
        .subscribe(res => {
          console.log(res)
        })
  }

  onCheckout(content) {
    if (this.checkoutText === 'Submit Order') {
      this.showSpinner = true;
      this.order = {
        user_id: this.user.userid,
        items: this.cart.items,
        restaurant_id: this.selectedRestaurant.id,
        restaurant_service_fee: this.selectedRestaurant.booking_fee,
        restaurant_delivery_fee: this.selectedRestaurant.delivery_fee,
        order_items_qty: this.cart.cart_qty,
        order_total: this.cart.cart_total,
        order_subtotal: this.cart.cart_subtotal,
        order_tax: this.cart.cart_tax,
        order_service_fee: this.cart.cart_service_fee,
        order_delivery_fee: this.cart.cart_delivery_fee,
        currency: this.selectedRestaurant.currency,
        currency_symbol: this.selectedRestaurant.currency_symbol,
        order_latitude: this.user.current_latitude,
        order_longitude: this.user.current_longitude,
        card_type: '',
        last4: 0,
        cart_id: this.cart.cart_id,
        customer_location: this.user.location_zipcode,
        order_type: this.selectedRestaurant.tnx_options,
        source: 'NONE',
        apple_pay_id: '',
        customer_name: this.user.fullname,
        client_id: 0
      };
      console.log(this.order)
      this.orderingService.post('order/new/add', { ...this.order, items: JSON.stringify(this.cart.items) })
        .subscribe(res => {
          console.log(res)
          this.showSpinner = false;
          if (!res.err) {
            this.updateUser()
            this.order.order_id = res.response.order_id
            this.order.date = new Date();
            // empty cart and update orders
            this.emptyCart(true);
            this.checkoutSection = false;
            this.thankyouSection = true;
          }
        })
    } else if (this.checkoutText === 'Add Driver Licence') {
      this.modalService.open(content);
    } else {
      // checkoutText = 'Keep Browsing'
      this.onGotoMenu();
    }
  }

  onUploadDL() {
    console.log('adding DL')
    const that = this
    let dl = ''
    this.showSpinner = true;

    this.uploader.onCompleteItem = function (item, response, status, headers) {
      const res = JSON.parse(response);
      if (item.alias === 'photo') {
        dl = res.URL;
      }
      console.log(item, res, status);
    };

    this.uploader.onCompleteAll = function () {
      that.user.driver_licence = dl
      that.apiService.post(`/user/driverlicence`, that.user)
        .subscribe(res => {
          console.log(res)
          setItem('user', that.user)
          that.checkoutText = 'Submit Order'
          that.showSpinner = false
          $('#close-modal').click()
        })
    }

    if (this.uploader.queue.length > 0) {
      console.log(this.uploader.queue)
      this.uploader.queue.forEach(item => {
          if (item.file.type.match(/image/)) {
              item.alias = 'photo';
              this.uploader.onBuildItemForm = (item, form) => {
                  form.append('path', 'profile_avatars/');
              };
              item.upload();
          }
      });
    } else {
      $('#close-modal').click()
      this.showSpinner = false
    }
  }

  getQuantity(id: number) {
    const data = this.cart.items && this.cart.items.filter((item)=> item.id === id)
    return data && data.length>0 ? data[0].qty : 0
  }

  readUrl(event) {
    document.getElementById('dl-img').setAttribute('src', URL.createObjectURL(event.target.files[0]));
  }

  onLogin() {
    this.router.navigate([`session/signin`]);
  }

  onSignup() {
    this.router.navigate([`session/signup`]);
  }

  backToHome() {
    this.router.navigate([`/`]);
  }
  logout()
  {
    localStorage.clear();
    this.router.navigate([`location`]).then(()=>{
   window.location.reload();
    })
  }
  toggleNav(isToggle) {
     this.toggle = isToggle;
  }

  
  submitemail()
  {
  const data={
   email:this.email,
   location:this.user.location
 }

    console.log(this.email)
    if(this.email)
    {
  this.orderingService.post(`restaurant/serviceRequest`,data ).subscribe(response => {
    console.log(response.msg);
    if (response.msg=="success") {

    this.notification.success("Thank you for your information.  We will reach out when availability is in your area.");
     this.backToHome();
    }else {
      this.email='';
      this.message = response.msg;
    
    }
  });
}
    }
    
  }

