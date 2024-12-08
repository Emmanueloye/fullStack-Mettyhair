import FooterWrapper from './FooterStyles';
import footerBg from '../../assets/images/footerbg.png';
import Container from '../../ui/Container';
import underline from '../../assets/images/whiteUnderline.png';
import { Link } from 'react-router-dom';
import { MdOutlineEmail } from 'react-icons/md';
import { ImInstagram } from 'react-icons/im';
import Icon from '../../ui/Icon';
import { FaFacebook, FaPhoneAlt, FaTwitter } from 'react-icons/fa';
import { FaThreads } from 'react-icons/fa6';
import { SettingTypes } from '../../dtos/settingDto';

const Footer = ({ setting }: { setting?: SettingTypes }) => {
  return (
    <FooterWrapper $bg={footerBg}>
      <Container>
        <div className='grid'>
          {/* col one */}
          <div className='footer brand-details'>
            <div className='header'>
              <h3>company</h3>
              <img src={underline} alt='underline' />
            </div>
            <ul>
              <li>
                <Link to='/'>About us</Link>
              </li>
              <li>
                <Link to='/'>FAQ</Link>
              </li>
              <li>
                <Link to={`tel:${setting?.contactPhone}`} className='contact'>
                  <Icon
                    icon={<FaPhoneAlt />}
                    text={setting?.contactPhone}
                    space='1rem'
                    iconSize='1.6rem'
                    color='var(--main-red-150)'
                  />
                </Link>
              </li>
              <li>
                <Link
                  to={`mailto:${setting?.contactEmail}`}
                  className='contact'
                >
                  <Icon
                    icon={<MdOutlineEmail />}
                    text={setting?.contactEmail}
                    space='1rem'
                    iconSize='1.6rem'
                    color='var(--main-red-150)'
                  />
                </Link>
              </li>
            </ul>
          </div>
          {/* col two */}
          <div className='footer help'>
            <div className='header'>
              <h3>get help</h3>
              <img src={underline} alt='underline' />
            </div>
            <ul>
              <li>
                <Link to='/'>Shipping</Link>
              </li>
              <li>
                <Link to='/'>Return</Link>
              </li>
              <li>
                <Link to='/'>Order status</Link>
              </li>
              <li>
                <Link to='/'>Payment options</Link>
              </li>
            </ul>
          </div>
          {/* col three */}
          <div className='footer products'>
            <div className='header'>
              <h3>online shop</h3>
              <img src={underline} alt='underline' />
            </div>
            <ul>
              <li>
                <Link to='/'>Human hairs</Link>
              </li>
              <li>
                <Link to='/'>Donor hairs</Link>
              </li>
              <li>
                <Link to='/'>Long hairs</Link>
              </li>
              <li>
                <Link to='/'>Curly hairs</Link>
              </li>
            </ul>
          </div>
          {/* col four */}
          <div className='footer socials'>
            <div className='header'>
              <h3>follow us</h3>
              <img src={underline} alt='underline' />
            </div>
            <ul>
              <li>
                <Link to={setting?.instagram || ''} target='_blank'>
                  <Icon
                    icon={<ImInstagram />}
                    text='instagram'
                    space='1rem'
                    color='var(--main-red-150)'
                  />
                </Link>
              </li>
              <li>
                <Link to={setting?.facebook || ''} target='_blank'>
                  <Icon
                    icon={<FaFacebook />}
                    text='facebook'
                    space='1rem'
                    color='var(--main-red-150)'
                  />
                </Link>
              </li>
              <li>
                <Link to={setting?.thread || ''} target='_blank'>
                  <Icon
                    icon={<FaThreads />}
                    text='thread'
                    space='1rem'
                    color='var(--main-red-150)'
                  />
                </Link>
              </li>
              <li>
                <Link to={setting?.twitter || ''} target='_blank'>
                  <Icon
                    icon={<FaTwitter />}
                    text='twiter'
                    space='1rem'
                    color='var(--main-red-150)'
                  />
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className='footer-note'>
          <small>&copy; Copyright {new Date().getFullYear()}</small>
          <small>Developed by Oyediran Emmanuel</small>
        </div>
      </Container>
    </FooterWrapper>
  );
};

export default Footer;
