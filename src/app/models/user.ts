export interface IUser {
    $key?: number;
    $exists?: any;
  
    user_id?: any;
    userid?: any;
    name?: string;
    fullname?: string;
    email?: string;
    password?: string;
    phone?: string;
    country_code?: string;
    code?: string;
    avatar?: string;
    profile_avatar?: string;
    profile_photo?: string;
    latitude?: number;
    longitude?: number;
    current_latitude?: number;
    current_longitude?: number;
    lang?: string;
    location?: string;
    location_apt?: string;
    location_zipcode?: string;
    isLoggedIn?: boolean;
    isPhoneVerified?: boolean;
    no_people_per_family?: any;
    driver_licence?: string;
  }
  export class User {
    user_id?: any;
    userid?: any;
    name?: string;
    fullname?: string;
    email?: string;
    password?: string;
    phone?: string;
    country_code?: string;
    code?: string;
    avatar?: string;
    profile_avatar?: string;
    profile_photo?: string;
    latitude?: number;
    longitude?: number;
    current_latitude?: number;
    current_longitude?: number;
    lang?: string;
    location?: string;
    location_apt?: string;
    location_zipcode?: string;
    isLoggedIn?: boolean;
    isPhoneVerified?: boolean;
    no_people_per_family?: any;
    driver_licence?: string;
  
    constructor() {
      this.user_id = 0;
      this.userid = 0;
      this.name = 'You';
      this.fullname = 'You';
      this.email = '';
      this.password = '';
      this.avatar = 'https://s3-us-west-1.amazonaws.com/paranoid-cdn/profile_avatars/FloydAvatar.png';
      this.profile_avatar = 'https://s3-us-west-1.amazonaws.com/paranoid-cdn/profile_avatars/FloydAvatar.png';
      this.profile_photo = '';
      this.longitude = 0.00;
      this.latitude = 0.00;
      this.current_longitude = 0.00;
      this.current_latitude = 0.00;
      this.lang = 'en';
      this.location = '';
      this.location_apt = '';
      this.location_zipcode = '';
      this.isLoggedIn = false;
      this.isPhoneVerified = false;
      this.no_people_per_family = 1;
      this.driver_licence = '';
    }
  }