import React from 'react';
//import logo from 'https://www.qlx.com/wp-content/uploads/2015/08/logo-1.png';
export const Nav00DataSource = {
  wrapper: { className: 'header0 home-page-wrapper' },
  page: { className: 'home-page' },
  logo: {
    className: 'header0-logo',
    children: 'https://www.qlx.com/wp-content/uploads/2015/08/logo-1.png', //logo navbar
  },
  Menu: {
    className: 'header0-menu',
    children: [
      {
        name: 'item0',
        className: 'header0-item',
        children: {
          href: '#',
          children: [{ children: '导航一', name: 'text' }],
        },
        subItem: [
          {
            name: 'sub0',
            className: 'item-sub',
            children: {
              className: 'item-sub-item',
              children: [
                {
                  name: 'image0',
                  className: 'item-image',
                  children:
                    'https://gw.alipayobjects.com/zos/rmsportal/ruHbkzzMKShUpDYMEmHM.svg',
                },
                {
                  name: 'title',
                  className: 'item-title',
                  children: 'QLX Design',
                },
                {
                  name: 'content',
                  className: 'item-content',
                  children: '企业级 UI 设计体系',
                },
              ],
            },
          },
          {
            name: 'sub1',
            className: 'item-sub',
            children: {
              className: 'item-sub-item',
              children: [
                {
                  name: 'image0',
                  className: 'item-image',
                  children:
                    'https://gw.alipayobjects.com/zos/rmsportal/ruHbkzzMKShUpDYMEmHM.svg',
                },
                {
                  name: 'title',
                  className: 'item-title',
                  children: 'Ant Design',
                },
                {
                  name: 'content',
                  className: 'item-content',
                  children: '企业级 UI 设计体系',
                },
              ],
            },
          },
        ],
      },
      {
        name: 'item1',
        className: 'header0-item',
        children: {
          href: '#',
          children: [{ children: '导航二', name: 'text' }],
        },
      },
      {
        name: 'item2',
        className: 'header0-item',
        children: {
          href: '#',
          children: [{ children: '导航三', name: 'text' }],
        },
      },
      {
        name: 'item3',
        className: 'header0-item',
        children: {
          href: '#',
          children: [{ children: '导航四', name: 'text' }],
        },
      },
    ],
  },
  mobileMenu: { className: 'header0-mobile-menu' },
};
export const Banner01DataSource = {
  wrapper: { className: 'banner0' },
  textWrapper: { className: 'banner0-text-wrapper' },
  title: {
    className: 'banner0-title',
    children: 'https://www.qlx.com/wp-content/uploads/2015/08/logo-1.png', //MAIN BANNER
  },
  content: {
    className: 'banner0-content',
    children: 'Offering comprehensive integrative advanced analytic software',
  },  
  button: { className: 'banner0-button', children: 'Learn More' },
};
export const Content00DataSource = {
  wrapper: { className: 'home-page-wrapper content0-wrapper' },
  page: { className: 'home-page content0' },
  OverPack: { playScale: 0.3, className: '' },
  titleWrapper: {
    className: 'title-wrapper',
    children: [{ name: 'title', children: 'EXPLORE i-Q GAMING' }], //SECOND BANNER
  },
  childWrapper: {
    className: 'content0-block-wrapper',
    children: [ //3 options in the 2nd banner
      {
        name: 'block0',
        className: 'content0-block',
        md: 8,
        xs: 24,
        children: {
          className: 'content0-block-item',
          children: [
            {
              name: 'image',
              className: 'content0-block-icon',
              children:
                'https://www.casinosofwinnipeg.com/wp-content/uploads/2018/07/iStock-155351788-1.jpg',
            },
            {
              name: 'title',
              className: 'content0-block-title',
              children: 'Slot & Table Game',
            },
            { name: 'content', children: 'Floor optimization & Sales/tracking matrix' },
          ],
        },
      },
      {
        name: 'block1',
        className: 'content0-block',
        md: 8,
        xs: 24,
        children: {
          className: 'content0-block-item',
          children: [
            {
              name: 'image',
              className: 'content0-block-icon',
              children:
                'https://www.casinovizion.com/wp-content/uploads/2015/08/peoplePlayingRoulette.png',
            },
            {
              name: 'title',
              className: 'content0-block-title',
              children: 'Game Preference',
            },
            {
              name: 'content',
              children: 'Player activity, Segmentation & Loyalty',
            },
          ],
        },
      },
      {
        name: 'block2',
        className: 'content0-block',
        md: 8,
        xs: 24,
        children: {
          className: 'content0-block-item',
          children: [
            {
              name: 'image',
              className: 'content0-block-icon',
              children:
                'https://zos.alipayobjects.com/rmsportal/EkXWVvAaFJKCzhMmQYiX.png',
            },
            {
              name: 'title',
              className: 'content0-block-title',
              children: 'Data Integration',
            },
            {
              name: 'content',
              children: 'Data influencing, Sales & Service',
            },
          ],
        },
      },
    ],
  },
};
export const Content50DataSource = { //Section of supported brands
  wrapper: { className: 'home-page-wrapper content5-wrapper' },
  page: { className: 'home-page content5' },
  OverPack: { playScale: 0.3, className: '' },
  titleWrapper: {
    className: 'title-wrapper',
    children: [
      { name: 'title', children: 'Qualex supports the following vendors', className: 'title-h1' },
      {
        name: 'content',
        className: 'title-content',
        children: '',
      },
    ],
  },
  block: {
    className: 'content5-img-wrapper',
    gutter: 16,
    children: [
      {
        name: 'block0',
        className: 'block',
        md: 6,
        xs: 24,
        children: {
          wrapper: { className: 'content5-block-content' },
          img: {
            children:
              'https://www.qlx.com/wp-content/uploads/2015/09/Ticketmaster.png',
          },
          content: { children: 'Ticket Master' },
        },
      },
      {
        name: 'block1',
        className: 'block',
        md: 6,
        xs: 24,
        children: {
          wrapper: { className: 'content5-block-content' },
          img: {
            children:
              'https://www.qlx.com/wp-content/uploads/2015/09/tickets.com-logo.jpg',
          },
          content: { children: 'Tickets.com' },
        },
      },
      {
        name: 'block2',
        className: 'block',
        md: 6,
        xs: 24,
        children: {
          wrapper: { className: 'content5-block-content' },
          img: {
            children:
              'https://www.qlx.com/wp-content/uploads/2015/09/veritix_logo.png',
          },
          content: { children: 'Veritix' },
        },
      },
      {
        name: 'block3',
        className: 'block',
        md: 6,
        xs: 24,
        children: {
          wrapper: { className: 'content5-block-content' },
          img: {
            children:
              'https://www.qlx.com/wp-content/uploads/2015/09/stonetimberriver.jpg',
          },
          content: { children: 'Stone Timber River' },
        },
      },
      {
        name: 'block4',
        className: 'block',
        md: 6,
        xs: 24,
        children: {
          wrapper: { className: 'content5-block-content' },
          img: {
            children:
              'https://www.qlx.com/wp-content/uploads/2015/09/salesforce-logo.png',
          },
          content: { children: 'Salesforce' },
        },
      },
      {
        name: 'block5',
        className: 'block',
        md: 6,
        xs: 24,
        children: {
          wrapper: { className: 'content5-block-content' },
          img: {
            children:
              'https://www.qlx.com/wp-content/uploads/2015/09/retailprologo.png',
          },
          content: { children: 'Retail Pro' },
        },
      },
      {
        name: 'block6',
        className: 'block',
        md: 6,
        xs: 24,
        children: {
          wrapper: { className: 'content5-block-content' },
          img: {
            children:
              'https://www.qlx.com/wp-content/uploads/2015/09/Oracle_Micros.png',
          },
          content: { children: 'ORACLE micros' },
        },
      },
      {
        name: 'block7',
        className: 'block',
        md: 6,
        xs: 24,
        children: {
          wrapper: { className: 'content5-block-content' },
          img: {
            children:
              'https://www.qlx.com/wp-content/uploads/2015/09/New-Era-Tickets.png',
          },
          content: { children: 'New Era Tickets' },
        },
      },
      {
        name: 'block8',
        className: 'block',
        md: 6,
        xs: 24,
        children: {
          wrapper: { className: 'content5-block-content' },
          img: {
            children:
              'https://www.qlx.com/wp-content/uploads/2015/09/Microsoft-Great-Plains.png',
          },
          content: { children: 'Microsoft Great Plains' },
        },
      },
      {
        name: 'block9',
        className: 'block',
        md: 6,
        xs: 24,
        children: {
          wrapper: { className: 'content5-block-content' },
          img: {
            children:
              'https://www.qlx.com/wp-content/uploads/2015/09/Microsoft-Dynamics-CRM.jpg',
          },
          content: { children: 'Microsoft Dynamics CRM' },
        },
      },
      {
        name: 'block10',
        className: 'block',
        md: 6,
        xs: 24,
        children: {
          wrapper: { className: 'content5-block-content' },
          img: {
            children:
              'https://www.qlx.com/wp-content/uploads/2015/09/micros.jpg',
          },
          content: { children: 'Micros' },
        },
      },
      {
        name: 'block11',
        className: 'block',
        md: 6,
        xs: 24,
        children: {
          wrapper: { className: 'content5-block-content' },
          img: {
            children:
              'https://www.qlx.com/wp-content/uploads/2015/09/logo-outbox.png',
          },
          content: { children: 'Outbox' },
        },
      },
      {
        name: 'block12',
        className: 'block',
        md: 6,
        xs: 24,
        children: {
          wrapper: { className: 'content5-block-content' },
          img: {
            children:
              'https://www.qlx.com/wp-content/uploads/2015/09/KORE_SOFTWARE_LOGO.png',
          },
          content: { children: 'Kore Software' },
        },
      },
      {
        name: 'block13',
        className: 'block',
        md: 6,
        xs: 24,
        children: {
          wrapper: { className: 'content5-block-content' },
          img: {
            children:
              'https://www.qlx.com/wp-content/uploads/2015/09/infogenesis-logo.jpg',
          },
          content: { children: 'InfoGenesis' },
        },
      },
      {
        name: 'block14',
        className: 'block',
        md: 6,
        xs: 24,
        children: {
          wrapper: { className: 'content5-block-content' },
          img: {
            children:
              'https://www.qlx.com/wp-content/uploads/2015/09/faninteractivelogo.gif',
          },
          content: { children: 'Fan Interactive Marketing' },
        },
      },
      {
        name: 'block15',
        className: 'block',
        md: 6,
        xs: 24,
        children: {
          wrapper: { className: 'content5-block-content' },
          img: {
            children:
              'https://www.qlx.com/wp-content/uploads/2015/09/experience-app.jpg',
          },
          content: { children: 'Experience App' },
        },
      },
      {
        name: 'block16',
        className: 'block',
        md: 6,
        xs: 24,
        children: {
          wrapper: { className: 'content5-block-content' },
          img: {
            children:
              'https://www.qlx.com/wp-content/uploads/2015/09/exact-target-logo.jpg',
          },
          content: { children: 'Exact Target' },
        },
      },
      {
        name: 'block17',
        className: 'block',
        md: 6,
        xs: 24,
        children: {
          wrapper: { className: 'content5-block-content' },
          img: {
            children:
              'https://www.qlx.com/wp-content/uploads/2015/09/channel-1-media-solutions.jpg',
          },
          content: { children: 'Channel 1 Media Solutions' },
        },
      },
      {
        name: 'block18',
        className: 'block',
        md: 6,
        xs: 24,
        children: {
          wrapper: { className: 'content5-block-content' },
          img: {
            children:
              'https://www.qlx.com/wp-content/uploads/2015/09/ampthink-logo.png',
          },
          content: { children: 'AMPThink' },
        },
      },
      {
        name: 'block19',
        className: 'block',
        md: 6,
        xs: 24,
        children: {
          wrapper: { className: 'content5-block-content' },
          img: {
            children:
              'https://www.qlx.com/wp-content/uploads/2015/09/alvarado-logo.png',
          },
          content: { children: 'Alvarado' },
        },
      },
    ],
  },
};
export const Content30DataSource = {
  wrapper: { className: 'home-page-wrapper content3-wrapper' },
  page: { className: 'home-page content3' }, //content5 has white bg, content3 has black one
  OverPack: { playScale: 0.3 },
  titleWrapper: {
    className: 'title-wrapper',
    children: [
      {
        name: 'title',
        children: 'PRICING',
        className: 'title-h1',
      },
      {
        name: 'content',
        className: 'title-content',
        children: 'Some description here',
      },
    ],
  },
  block: {
    className: 'content3-block-wrapper',
    children: [
      {
        name: 'block0',
        className: 'content3-block',
        md: 8,
        xs: 24,
        children: {
          icon: {
            className: 'content3-icon',
            children:
              'https://zos.alipayobjects.com/rmsportal/ScHBSdwpTkAHZkJ.png',
          },
          textWrapper: { className: 'content3-text' },
          title: { className: 'content3-title', children: 'SERVICE 1' },
          content: {
            className: 'content3-content',
            children:
              'Description 1',
          },
        },
      },
      {
        name: 'block1',
        className: 'content3-block',
        md: 8,
        xs: 24,
        children: {
          icon: {
            className: 'content3-icon',
            children:
              'https://zos.alipayobjects.com/rmsportal/NKBELAOuuKbofDD.png',
          },
          textWrapper: { className: 'content3-text' },
          title: { className: 'content3-title', children: 'SERVICE 2' },
          content: {
            className: 'content3-content',
            children:
              'Description 2',
          },
        },
      },
      {
        name: 'block2',
        className: 'content3-block',
        md: 8,
        xs: 24,
        children: {
          icon: {
            className: 'content3-icon',
            children:
              'https://zos.alipayobjects.com/rmsportal/xMSBjgxBhKfyMWX.png',
          },
          textWrapper: { className: 'content3-text' },
          title: { className: 'content3-title', children: 'SERVICE 3' },
          content: {
            className: 'content3-content',
            children:
              'Description 3',
          },
        },
      },
      {
        name: 'block3',
        className: 'content3-block',
        md: 8,
        xs: 24,
        children: {
          icon: {
            className: 'content3-icon',
            children:
              'https://zos.alipayobjects.com/rmsportal/MNdlBNhmDBLuzqp.png',
          },
          textWrapper: { className: 'content3-text' },
          title: { className: 'content3-title', children: 'SERVICE 4' },
          content: {
            className: 'content3-content',
            children:
              'Description 4',
          },
        },
      },
      {
        name: 'block4',
        className: 'content3-block',
        md: 8,
        xs: 24,
        children: {
          icon: {
            className: 'content3-icon',
            children:
              'https://zos.alipayobjects.com/rmsportal/UsUmoBRyLvkIQeO.png',
          },
          textWrapper: { className: 'content3-text' },
          title: { className: 'content3-title', children: 'SERVICE 5' },
          content: {
            className: 'content3-content',
            children:
              'Description 5',
          },
        },
      },
      {
        name: 'block5',
        className: 'content3-block',
        md: 8,
        xs: 24,
        children: {
          icon: {
            className: 'content3-icon',
            children:
              'https://zos.alipayobjects.com/rmsportal/ipwaQLBLflRfUrg.png',
          },
          textWrapper: { className: 'content3-text' },
          title: { className: 'content3-title', children: 'SERVICE 6' },
          content: {
            className: 'content3-content',
            children:
              'Description 6',
          },
        },
      },
    ],
  },
};
export const Footer10DataSource = { //Footer
  wrapper: { className: 'home-page-wrapper footer1-wrapper' },
  OverPack: { className: 'footer1', playScale: 0.2 },
  block: {
    className: 'home-page',
    gutter: 0,
    children: [
      {
        name: 'block0',
        xs: 24,
        md: 6,
        className: 'block',
        title: {
          className: 'logo',
          children:
            'https://www.qlx.com/wp-content/uploads/2015/08/logo-1.png',
        },
        childWrapper: {
          className: 'slogan',
          children: [
            {
              name: 'content0',
              children: 'Qualex Vision is to deliver Quality and Experience, Anytime and Anywhere.',
            },
          ],
        },
      },
      {
        name: 'block1',
        xs: 24,
        md: 6,
        className: 'block',
        title: { children: 'PRICING' },
        childWrapper: {
          children: [
            { name: 'link0', href: 'https://www.qlx.com/iq-solutions/', children: 'IQ SOLUTIONS' },
            { name: 'link1', href: 'https://www.qlx.com/careers/', children: 'CARRERS' },
            { name: 'link2', href: 'https://www.qlx.com/software-sales/', children: 'SOFTWARE SALES' },
            { name: 'link3', href: 'https://www.qlx.com/consulting-services/', children: 'CONSULTING SERVICES' },
          ],
        },
      },
      {
        name: 'block2',
        xs: 24,
        md: 6,
        className: 'block',
        title: { children: 'ABOUT US' },
        childWrapper: {
          children: [
            { href: 'https://www.qlx.com/about-us/', name: 'link0', children: 'FAQ' },
            { href: '#', name: 'link1', children: 'OUR VISION' },            
            { href: 'https://www.qlx.com/blog/', name: 'link2', children: 'QUALEX BLOG' },
            { href: 'https://www.qlx.com/privacy-policy/', name: 'link3', children: 'PRIVACY POLICY' },
            { href: 'https://www.qlx.com/disclaimer/', name: 'link4', children: 'DISCLAIMER' },
          ],
        },
      },
      {
        name: 'block3',
        xs: 24,
        md: 6,
        className: 'block',
        title: { children: 'CONTACT US' },
        childWrapper: {
          children: [
            { href: 'https://www.qlx.com/contact-us/', name: 'link0', children: 'OUR HQ' },
            /* { href: '#', name: 'link1', children: 'Ant Motion' }, */
          ],
        },
      },
    ],
  },
  copyrightWrapper: { className: 'copyright-wrapper' },
  copyrightPage: { className: 'home-page' },
  copyright: {
    className: 'copyright',
    children: (
      <span>
        ©2023 by <a href="https://www.qlx.com/">QUALEX</a> All Rights
        Reserved
      </span>
    ),
  },
};
