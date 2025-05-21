import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { main_styles } from '../theme/main_styles'
import { Image } from 'react-native';

import HomeIconSVG from '../../assets/icons/home.svg'
import HomeIconActiveSVG from '../../assets/icons/home_active.svg'

import OfferIconSVG from '../../assets/icons/offer.svg'
import OfferIconActiveSVG from '../../assets/icons/offer_active.svg'

import PartnerIconSVG from '../../assets/icons/partner.svg'
import PartnerActiveSVG from '../../assets/icons/partner_active.svg'

import SpendIconSVG from '../../assets/icons/spend.svg'
import SpendIconActiveSVG from '../../assets/icons/spend_active.svg'

import MyAccountIconSVG from '../../assets/icons/my_account.svg'
import MyAccountIconActiveSVG from '../../assets/icons/my_account_active.svg'
import MyAccountIconSideBarSVG from '../../assets/icons/my_account_sidebar.svg'

import AboutIconSVG from '../../assets/icons/about.svg'
import ContactIconSVG from '../../assets/icons/contact.svg'
import TermAndConditionIconSVG from '../../assets/icons/term_condition.svg'
import FAQIconSVG from '../../assets/icons/faq.svg'
import LogOutIconSVG from '../../assets/icons/logout.svg'

import TransactionIconSVG from '../../assets/icons/transaction.svg'
import NotificationIconSVG from '../../assets/icons/notification.svg'
import CardIconSVG from '../../assets/icons/card.svg'
import { Icon } from 'react-native-vector-icons/Icon';

export const MenuBarIcon = (props) => <FontAwesome5 name='bars' style={[main_styles.icon_normal]} {...props} />
export const BackIcon = (props) => <FontAwesome5 name='angle-left' style={[main_styles.icon_normal]} {...props} />
export const LockIcon = (props) => <FontAwesome5 name='lock' style={[main_styles.icon_normal]} {...props} />
export const WarningIcon = (props) => <FontAwesome5 name='angle-left' style={[main_styles.icon_normal]} {...props} />
export const ErrorIcon = (props) => <FontAwesome5 name='times' style={[main_styles.icon_normal]} {...props} />
export const RightArrowIcon = (props) => <FontAwesome5 name='chevron-right' style={[main_styles.icon_normal]} {...props} />
export const CameraIcon = (props) => <FontAwesome5 name='camera' style={[main_styles.icon_normal]} {...props} />
export const SettingIcon = (props) => <FontAwesome5 name='cog' style={[main_styles.icon_normal]} {...props} />
export const CircleIcon = (props) => <FontAwesome5 name='circle' style={[main_styles.icon_normal]} {...props} />
export const PostedIcon = (props) => <FontAwesome5 name='check-circle' style={[main_styles.icon_small, { color:'#2ecc71' }]} {...props} />
export const CancelIcon = (props) => <FontAwesome5 name='times-circle' style={[main_styles.icon_small, { color: '#95a5a6' } ]} {...props} />
export const EditIcon = (props) => <FontAwesome5 name='pencil-alt' style={[main_styles.icon_small]} {...props} />
export const SaveIcon = (props) => <FontAwesome5 name='check' style={[main_styles.icon_small, { color:'#2ecc71' }]} {...props} />
export const CancelEditIcon = (props) => <FontAwesome5 name='times' style={[main_styles.icon_small, { color: 'red' }]} {...props} />

export const SwitchIcon = (props) => <Image style={[main_styles.icon_image.medium]} source={require('../../assets/images/switch.png')} {...props} />
export const SwitchActive = (props) => <Image style={[main_styles.icon_image.medium]} source={require('../../assets/images/switch_active.png')} {...props} />
export const ArrowDown = (props) => <Image style={[main_styles.icon_image.medium]} source={require('../../assets/images/keyboard_arrow_down-24px.png')} {...props} />
export const LogOutIcon = (props) => <Image style={[main_styles.icon_image.medium]} source={require('../../assets/images/exit_to_app-24px.png')} {...props} />
export const CouponIcon = (props) => <Image style={[main_styles.icon_image.medium]} source={require('../../assets/images/coupon.png')} {...props} />
export const SearchIcon = (props) => <Image style={[main_styles.icon_image.medium]} source={require('../../assets/images/search-24px.png')} {...props} />

export const HomeIconActive = (props) => <HomeIconActiveSVG width={main_styles.icon_image.medium.width} height={main_styles.icon_image.medium.height} {...props} />
export const HomeIcon = (props) => <HomeIconSVG width={main_styles.icon_image.medium.width} height={main_styles.icon_image.medium.height} {...props} />
export const OffersIconActive = (props) => <OfferIconActiveSVG width={main_styles.icon_image.medium.width} height={main_styles.icon_image.medium.height} {...props} />
export const OffersIcon = (props) => <OfferIconSVG width={main_styles.icon_image.medium.width} height={main_styles.icon_image.medium.height} {...props} />
export const MerchantIconActive = (props) => <PartnerActiveSVG width={main_styles.icon_image.medium.width} height={main_styles.icon_image.medium.height} {...props} />
export const MerchantIcon = (props) => <PartnerIconSVG width={main_styles.icon_image.medium.width} height={main_styles.icon_image.medium.height} {...props} />
export const SpendIconActive = (props) => <SpendIconActiveSVG width={main_styles.icon_image.medium.width} height={main_styles.icon_image.medium.height} {...props} />
export const SpendIconIcon = (props) => <SpendIconSVG width={main_styles.icon_image.medium.width} height={main_styles.icon_image.medium.height} {...props} />
export const AccountIconActive = (props) => <MyAccountIconActiveSVG width={main_styles.icon_image.medium.width} height={main_styles.icon_image.medium.height} {...props} />
export const AccountIcon = (props) => <MyAccountIconSVG width={main_styles.icon_image.medium.width} height={main_styles.icon_image.medium.height} {...props} />
export const MyAccountIconSideBar = (props) => <MyAccountIconSideBarSVG width={main_styles.icon_image.medium.width} height={main_styles.icon_image.medium.height} {...props} />
export const CreditCardIcon = (props) => <CardIconSVG width={main_styles.icon_image.medium.width} height={main_styles.icon_image.medium.height} {...props} />
export const TransactionsIcon = (props) => <TransactionIconSVG width={main_styles.icon_image.medium.width} height={main_styles.icon_image.medium.height} {...props} />
export const NotificationsIcon = (props) => <NotificationIconSVG width={main_styles.icon_image.medium.width} height={main_styles.icon_image.medium.height} {...props} />
export const FAQIcon = (props) => <FAQIconSVG width={main_styles.icon_image.medium.width} height={main_styles.icon_image.medium.height} {...props} />
export const TermAndConditionIcon = (props) => <TermAndConditionIconSVG width={main_styles.icon_image.medium.width} height={main_styles.icon_image.medium.height} {...props} />
export const InfoIcon = (props) => <AboutIconSVG width={main_styles.icon_image.medium.width} height={main_styles.icon_image.medium.height} {...props} />
export const EnvelopeIcon = (props) => <ContactIconSVG width={main_styles.icon_image.medium.width} height={main_styles.icon_image.medium.height} {...props} />
export const LogOutIconActive = (props) => <LogOutIconSVG width={main_styles.icon_image.medium.width} height={main_styles.icon_image.medium.height} {...props} />

export const MobileIcon = (props) => <Icon name='ios-call' style={[main_styles.icon_image.medium, main_styles.icon_color_primary]} {...props} />
export const MobileIconWhite = (props) => <Icon name='ios-call' style={[main_styles.icon_image.medium, main_styles.icon_color_white]} {...props} />
export const MobileIconDark = (props) => <Icon name='ios-call' style={[main_styles.icon_image.xsmall, main_styles.icon_color_default]} {...props} />

