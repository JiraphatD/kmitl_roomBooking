const { PrismaClient } = require('@prisma/client');
const { connectors } = require('googleapis/build/src/apis/connectors');
const prisma = new PrismaClient();

async function seedData() {
  try {
    // Delete old records
    await prisma.accessories.deleteMany({});
    await prisma.advertiseRoom.deleteMany({});
    await prisma.advertise.deleteMany({});
    await prisma.booking.deleteMany({});
    await prisma.approvement.deleteMany({});
    await prisma.booker.deleteMany({});
    await prisma.software.deleteMany({});
    await prisma.laboratory.deleteMany({});
    await prisma.room.deleteMany({});
    // Seed data for the "Room" table
    await prisma.room.createMany({
      data: [
        //floor 1
        {
          id: 'HALL',
          room_name: 'โถงอเนกประสงค์',
          room_category: 'Multi_Purpose_Hall',
          description: 'โถงสำหรับจัดกิจกรรม',
          room_image: '/assets/img/404.jpg',
          room_status: 'Available',
          floor: 1,
          seat: 0,
        },
        {
          id: 'AUDITORIUM',
          room_name: 'AUDITORIUM',
          room_category: 'Large_Conference_Room',
          description: 'ห้องประชุมขนาดใหญ่สำหรับบรรยายหรือจัดกิจกรรม',
          room_image: '/assets/img/floor_1/Audi.jpg',
          room_status: 'Available',
          floor: 1,
          seat: 220,
        },

        {
          id: 'COMMON',
          room_name: 'ห้องส่วนกลาง',
          room_category: 'Entertainment_Room',
          description: 'ห้องสำหรับทำกิจกรรมสันทนาการ',
          room_image: '/assets/img/404.jpg',
          room_status: 'Active',
          floor: 1,
          seat: 50,
        },

        {
          id: 'R111',
          room_name: 'ห้องสันทนาการ',
          room_category: 'Entertainment_Room',
          description: 'ห้องสำหรับทำกิจกรรมสันทนาการ',
          room_image: '/assets/img/floor_1/R111.jpg',
          room_status: 'Active',
          floor: 1,
          seat: 0,
        },

        {
          id: 'M03',
          room_name: 'M03',
          room_category: 'Large_Lecture_Room',
          description: 'ห้องสำหรับบรรยาย',
          room_image: '/assets/img/floor_1/M03.jpg',
          room_status: 'Available',
          floor: 1,
          seat: 90,
        },

        {
          id: 'M04',
          room_name: 'M04',
          room_category: 'Large_Lecture_Room',
          description: 'ห้องสำหรับบรรยาย',
          room_image: '/assets/img/floor_1/M04.jpg',
          room_status: 'Available',
          floor: 1,
          seat: 90,
        },

        {
          id: 'M05',
          room_name: 'ห้องบริการนักศึกษา',
          room_category: 'Education_Service_Room',
          description: 'ห้องบริการนักศึกษา',
          room_image: '/assets/img/floor_1/M05.jpg',
          room_status: 'Active',
          floor: 1,
          seat: 50,
        },

        {
          id: 'M12',
          room_name: 'ห้องงานกิจกรรม',
          room_category: 'Education_Service_Room',
          description: 'ห้องงานกิจกรรม',
          room_image: '/assets/img/404.jpg',
          room_status: 'Available',
          floor: 1,
          seat: 0,
        },

        {
          id: 'M13',
          room_name: 'ห้องเก็บอุปกรณ์',
          room_category: 'None',
          description: 'ห้องเก็บอุปกรณ์',
          room_image: '/assets/img/404.jpg',
          room_status: 'Available',
          floor: 1,
          seat: 0,
        },

        {
          id: 'M14',
          room_name: 'ห้องเก็บอุปกรณ์',
          room_category: 'None',
          description: 'ห้องเก็บอุปกรณ์',
          room_image: '/assets/img/404.jpg',
          room_status: 'Available',
          floor: 1,
          seat: 0,
        },

        {
          id: 'M15',
          room_name: 'ห้องเก็บอุปกรณ์',
          room_category: 'None',
          description: 'ห้องเก็บอุปกรณ์',
          room_image: '/assets/img/404.jpg',
          room_status: 'Available',
          floor: 1,
          seat: 0,
        },

        {
          id: 'M16',
          room_name: 'M16',
          room_category: 'Small_Lecture_Room',
          description: 'ห้องสำหรับบรรยาย',
          room_image: '/assets/img/floor_1/M16.jpg',
          room_status: 'Available',
          floor: 1,
          seat: 30,
        },

        {
          id: 'M17',
          room_name: 'M17',
          room_category: 'Small_Lecture_Room',
          description: 'ห้องสำหรับบรรยาย',
          room_image: '/assets/img/floor_1/M17.jpg',
          room_status: 'Available',
          floor: 1,
          seat: 20,
        },

        {
          id: 'M18',
          room_name: 'M18',
          room_category: 'Small_Lecture_Room',
          description: 'ห้องสำหรับบรรยาย',
          room_image: '/assets/img/floor_1/M18.jpg',
          room_status: 'Available',
          floor: 1,
          seat: 30,
        },

        //   { id: 'M19',
        //   room_name: 'M19',
        //   room_category: 'None',
        //   description: 'ห้องสำหรับบรรยาย',
        //   room_image: '/assets/img/404.jpg',
        //   room_status: 'Available',
        //   floor: 1,
        //   seat: 50,

        // { id: 'M20',
        // room_name: 'M20',
        // room_category: 'None',
        // description: 'ห้องสำหรับบรรยาย',
        // room_image: '/assets/img/404.jpg',
        // room_status: 'Available',
        // floor: 1,
        // seat: 50,

        {
          id: 'M21',
          room_name: 'M21',
          room_category: 'Large_Lecture_Room',
          description: 'ห้องสำหรับบรรยาย',
          room_image: '/assets/img/floor_1/M21.jpg',
          room_status: 'Available',
          floor: 1,
          seat: 90,
        },

        {
          id: 'M22',
          room_name: 'M22',
          room_category: 'Large_Lecture_Room',
          description: 'ห้องสำหรับบรรยาย',
          room_image: '/assets/img/floor_1/M22.jpg',
          room_status: 'Available',
          floor: 1,
          seat: 90,
        },

        {
          id: 'M23',
          room_name: 'M23',
          room_category: 'Large_Lecture_Room',
          description: 'ห้องสำหรับบรรยาย',
          room_image: '/assets/img/floor_1/M23.jpg',
          room_status: 'Available',
          floor: 1,
          seat: 90,
        },

        // {
        //   id: 'M24',
        //   room_name: 'M24',
        //   room_category: 'None',
        //   description: 'ห้องสำหรับบรรยาย',
        //   room_image: '/assets/img/404.jpg',
        //   room_status: 'Available',
        //   floor: 1,
        //   seat: 50,
        // },

        //floor 2
        {
          id: '203',
          room_name: '203',
          room_category: 'Large_Laboratory_Room',
          description: 'ห้องสำหรับปฏิบัติการคอมพิวเตอร์',
          room_image: '/assets/img/floor_2/203.jpg',
          room_status: 'Available',
          floor: 2,
          seat: 80,
        },

        {
          id: '205',
          room_name: '205',
          room_category: 'Small_Laboratory_Room',
          description: 'ห้องสำหรับปฏิบัติการคอมพิวเตอร์',
          room_image: '/assets/img/floor_2/205.jpg',
          room_status: 'Available',
          floor: 2,
          seat: 60,
        },

        {
          id: '207',
          room_name: '207',
          room_category: 'Large_Laboratory_Room',
          description: 'ห้องสำหรับปฏิบัติการคอมพิวเตอร์',
          room_image: '/assets/img/floor_2/207.jpg',
          room_status: 'Available',
          floor: 2,
          seat: 80,
        },

        // {
        //   id: '209',
        //   room_name: '209',
        //   room_category: 'None',
        //   description: 'ห้องสำหรับปฏิบัติการคอมพิวเตอร์',
        //   room_image: '/assets/img/404.jpg',
        //   room_status: 'Available',
        //   floor: 2,
        //   seat: 50,
        // },

        {
          id: '215',
          room_name: 'ห้องสมุด',
          room_category: 'None',
          description: 'ห้องสมุด',
          room_image: '/assets/img/404.jpg',
          room_status: 'Available',
          floor: 2,
          seat: 50,
        },

        {
          id: 'PT1',
          room_name: 'Peer Tutor 1',
          room_category: 'Education_Service_Room',
          description: 'ห้องสำหรับกิจกรรมสันทนาการ',
          room_image: '/assets/img/floor_2/reIMG.jpg',
          room_status: 'Available',
          floor: 2,
          seat: 10,
        },

        {
          id: 'PT2',
          room_name: 'Peer Tutor 2',
          room_category: 'Education_Service_Room',
          description: 'ห้องสำหรับกิจกรรมสันทนาการ',
          room_image: '/assets/img/floor_2/reIMG.jpg',
          room_status: 'Available',
          floor: 2,
          seat: 10,
        },

        {
          id: 'PT3',
          room_name: 'Peer Tutor 3',
          room_category: 'Education_Service_Room',
          description: 'ห้องสำหรับกิจกรรมสันทนาการ',
          room_image: '/assets/img/floor_2/reIMG.jpg',
          room_status: 'Available',
          floor: 2,
          seat: 10,
        },

        // {
        //   id: '219',
        //   room_name: '219',
        //   room_category: 'Small_Laboratory_Room',
        //   description: 'ห้องสำหรับปฏิบัติการคอมพิวเตอร์',
        //   room_image: '/assets/img/404.jpg',
        //   room_status: 'Available',
        //   floor: 2,
        //   seat: 50,
        // },

        {
          id: 'C1',
          room_name: 'Creative and Ideation 1',
          room_category: 'Education_Service_Room',
          description: 'ห้องสำหรับกิจกรรมสันทนาการ',
          room_image: '/assets/img/floor_2/reIMG.jpg',
          room_status: 'Available',
          floor: 2,
          seat: 20,
        },

        {
          id: 'C2',
          room_name: 'Creative and Ideation 2',
          room_category: 'Education_Service_Room',
          description: 'ห้องสำหรับกิจกรรมสันทนาการ',
          room_image: '/assets/img/floor_2/reIMG.jpg',
          room_status: 'Available',
          floor: 2,
          seat: 20,
        },

        // {
        //   id: '222',
        //   room_name: '222',
        //   room_category: 'Small_Lecture_Room',
        //   description: 'ห้องสำหรับปฏิบัติการคอมพิวเตอร์',
        //   room_image: '/assets/img/404.jpg',
        //   room_status: 'Available',
        //   floor: 2,
        //   seat: 50,
        // },

        {
          id: 'Project Base1',
          room_name: 'Project Base1',
          room_category: 'Large_Lecture_Room',
          description: 'ห้องสำหรับปฏิบัติการคอมพิวเตอร์',
          room_image: '/assets/img/floor_2/PB1.jpg',
          room_status: 'Available',
          floor: 2,
          seat: 60,
        },

        // {
        //   id: '224',
        //   room_name: '224',
        //   room_category: 'Small_Lecture_Room',
        //   description: 'ห้องสำหรับปฏิบัติการคอมพิวเตอร์',
        //   room_image: '/assets/img/floor_2/PB1.jpg',
        //   room_status: 'Available',
        //   floor: 2,
        //   seat: 50,
        // },

        {
          id: 'Project Base2',
          room_name: 'Project Base2',
          room_category: 'Large_Lecture_Room',
          description: 'ห้องสำหรับปฏิบัติการคอมพิวเตอร์',
          room_image: '/assets/img/floor_2/PB2.jpg',
          room_status: 'Available',
          floor: 2,
          seat: 60,
        },

        // {
        //   id: '226',
        //   room_name: '226',
        //   room_category: 'Large_Lecture_Room',
        //   description: 'ห้องสำหรับปฏิบัติการคอมพิวเตอร์',
        //   room_image: '/assets/img/floor_2/PB2.jpg',
        //   room_status: 'Available',
        //   floor: 2,
        //   seat: 50,
        // },

        //floor 3
        {
          id: '304',
          room_name: '304',
          room_category: 'Large_Laboratory_Room',
          description: 'ห้องสำหรับปฏิบัติการคอมพิวเตอร์',
          room_image: '/assets/img/floor_3/304.jpg',
          room_status: 'Available',
          floor: 3,
          seat: 60,
        },

        {
          id: '306',
          room_name: '306',
          room_category: 'Small_Laboratory_Room',
          description: 'ห้องสำหรับปฏิบัติการคอมพิวเตอร์',
          room_image: '/assets/img/floor_3/306.jpg',
          room_status: 'Available',
          floor: 3,
          seat: 47,
        },

        {
          id: '308',
          room_name: '308',
          room_category: 'Large_Laboratory_Room',
          description: 'ห้องสำหรับปฏิบัติการคอมพิวเตอร์',
          room_image: '/assets/img/floor_3/308.jpg',
          room_status: 'Available',
          floor: 3,
          seat: 80,
        },

        {
          id: '310',
          room_name: 'ห้องบริหารทรัพยากรบุคคล',
          room_category: 'None',
          description: 'ห้องบริหารทรัพยากรบุคคล',
          room_image: '/assets/img/404.jpg',
          room_status: 'Available',
          floor: 3,
          seat: 50,
        },

        {
          id: '316',
          room_name: '316',
          room_category: 'None',
          description: 'None',
          room_image: '/assets/img/404.jpg',
          room_status: 'Available',
          floor: 3,
          seat: 50,
        },

        {
          id: '317',
          room_name: '317',
          room_category: 'None',
          description: 'None',
          room_image: '/assets/img/404.jpg',
          room_status: 'Available',
          floor: 3,
          seat: 50,
        },

        {
          id: '322',
          room_name: '',
          room_category: 'None',
          description: 'ห้องศูนย์เครือข่าย',
          room_image: '/assets/img/404.jpg',
          room_status: 'Available',
          floor: 3,
          seat: 0,
        },

        // {
        //   id: '322/1',
        //   room_name: '322/1',
        //   room_category: 'None',
        //   description: 'ห้องสำหรับปฏิบัติการ',
        //   room_image: '/assets/img/404.jpg',
        //   room_status: 'Available',
        //   floor: 3,
        //   seat: 50,
        // },

        // {
        //   id: '322/2',
        //   room_name: '322/2',
        //   room_category: 'None',
        //   description: 'ห้องสำหรับปฏิบัติการ',
        //   room_image: '/assets/img/404.jpg',
        //   room_status: 'Available',
        //   floor: 3,
        //   seat: 50,
        // },

        {
          id: '323',
          room_name: 'ห้องเจ้าหน้าที่สนับสนุน',
          room_category: 'Support_Room',
          description: 'ห้องเจ้าหน้าที่สนับสนุน',
          room_image: '/assets/img/404.jpg',
          room_status: 'Available',
          floor: 3,
          seat: 20,
        },

        {
          id: '324',
          room_name: 'ห้องเก็บอุปกรณ์',
          room_category: 'None',
          description: 'ห้องเก็บอุปกรณ์',
          room_image: '/assets/img/404.jpg',
          room_status: 'Available',
          floor: 3,
          seat: 0,
        },

        {
          id: '325',
          room_name: 'ห้องบริการนักศึกษา',
          room_category: 'Education_Service_Room',
          description: 'ห้องบริการนักศึกษา',
          room_image: '/assets/img/404.jpg',
          room_status: 'Available',
          floor: 3,
          seat: 10,
        },

        {
          id: '328',
          room_name: '328',
          room_category: 'Medium_Lecture_Room',
          description: 'ห้องสำหรับบรรยาย',
          room_image: '/assets/img/floor_3/328.jpg',
          room_status: 'Available',
          floor: 3,
          seat: 50,
        },

        {
          id: 'Project Base3',
          room_name: 'Project Base3',
          room_category: 'Large_Lecture_Room',
          description: 'ห้องสำหรับบรรยาย',
          room_image: '/assets/img/floor_3/PB4.jpg',
          room_status: 'Available',
          floor: 3,
          seat: 75,
        },

        // {
        //   id: '330',
        //   room_name: '330',
        //   room_category: 'Small_Lecture_Room',
        //   description: 'ห้องสำหรับปฏิบัติการ',
        //   room_image: '/assets/img/floor_3/PB4.jpg',
        //   room_status: 'Available',
        //   floor: 3,
        //   seat: 50,
        // },

        {
          id: '331',
          room_name: 'ห้องเก็บอุปกรณ์',
          room_category: 'None',
          description: 'ห้องเก็บอุปกรณ์',
          room_image: '/assets/img/404.jpg',
          room_status: 'Available',
          floor: 3,
          seat: 0,
        },

        {
          id: '332',
          room_name: 'ห้องเก็บอุปกรณ์',
          room_category: 'None',
          description: 'ห้องเก็บอุปกรณ์',
          room_image: '/assets/img/404.jpg',
          room_status: 'Available',
          floor: 3,
          seat: 0,
        },

        {
          id: '333',
          room_name: '333',
          room_category: 'Small_Laboratory_Room',
          description: 'ห้องสำหรับปฏิบัติการคอมพิวเตอร์',
          room_image: '/assets/img/floor_3/333.jpg',
          room_status: 'Available',
          floor: 3,
          seat: 30,
        },

        {
          id: 'Project Base4',
          room_name: 'Project Base4',
          room_category: 'Large_Lecture_Room',
          description: 'ห้องสำหรับบรรยาย',
          room_image: '/assets/img/floor_3/PB3.jpg',
          room_status: 'Available',
          floor: 3,
          seat: 75,
        },

        // {
        //   id: '335',
        //   room_name: '335',
        //   room_category: 'Small_Lecture_Room',
        //   description: 'ห้องสำหรับปฏิบัติการ',
        //   room_image: '/assets/img/floor_3/PB3.jpg',
        //   room_status: 'Available',
        //   floor: 3,
        //   seat: 50,
        // },

        //floor 4
        {
          id: '403',
          room_name: '403',
          room_category: 'Small_Lecture_Room',
          description: 'ห้องสำหรับบรรยาย',
          room_image: '/assets/img/floor_4/403.jpg',
          room_status: 'Available',
          floor: 4,
          seat: 40,
        },

        {
          id: '404',
          room_name: '404',
          room_category: 'Small_Lecture_Room',
          description: 'ห้องสำหรับบรรยาย',
          room_image: '/assets/img/floor_4/404.jpg',
          room_status: 'Available',
          floor: 4,
          seat: 30,
        },

        {
          id: '406',
          room_name: '406',
          room_category: 'Large_Lecture_Room',
          description: 'ห้องสำหรับบรรยาย',
          room_image: '/assets/img/floor_4/406.jpg',
          room_status: 'Available',
          floor: 4,
          seat: 80,
        },

        {
          id: '410',
          room_name: 'ห้อง Deep Tech',
          room_category: 'Education_Service_Room',
          description: 'ห้อง Deep Tech',
          room_image: '/assets/img/floor_4/409.jpg',
          room_status: 'Available',
          floor: 4,
          seat: 20,
        },

        {
          id: '412',
          room_name: 'ห้อง UX/UI LAB',
          room_category: 'Education_Service_Room',
          description: 'ห้อง UX/UI LAB',
          room_image: '/assets/img/floor_4/409.jpg',
          room_status: 'Available',
          floor: 4,
          seat: 20,
        },

        {
          id: '416',
          room_name: '416',
          room_category: 'None',
          description: 'None',
          room_image: '/assets/img/404.jpg',
          room_status: 'Available',
          floor: 4,
          seat: 0,
        },

        {
          id: '418',
          room_name: '418',
          room_category: 'None',
          description: 'None',
          room_image: '/assets/img/404.jpg',
          room_status: 'Available',
          floor: 4,
          seat: 0,
        },

        // {
        //   id: '423',
        //   room_name: '423',
        //   room_category: 'None',
        //   description: 'ห้องสำหรับบรรยาย',
        //   room_image: '/assets/img/404.jpg',
        //   room_status: 'Available',
        //   floor: 4,
        //   seat: 50,
        // },

        {
          id: '424',
          room_name: 'ห้อง IOT',
          room_category: 'Education_Service_Room',
          description: 'ห้อง IOT',
          room_image: '/assets/img/404.jpg',
          room_status: 'Available',
          floor: 4,
          seat: 30,
        },

        {
          id: '426',
          room_name: 'ห้อง Metaverse',
          room_category: 'Education_Service_Room',
          description: 'ห้อง Metaverse',
          room_image: '/assets/img/404.jpg',
          room_status: 'Available',
          floor: 4,
          seat: 30,
        },

        {
          id: '427',
          room_name: '',
          room_category: 'None',
          description: 'ห้องสำหรับบรรยาย',
          room_image: '/assets/img/404.jpg',
          room_status: 'Available',
          floor: 4,
          seat: 0,
        },

        {
          id: '428',
          room_name: '',
          room_category: 'None',
          description: 'ห้องสำหรับบรรยาย',
          room_image: '/assets/img/404.jpg',
          room_status: 'Available',
          floor: 4,
          seat: 0,
        },

        {
          id: '430',
          room_name: '430',
          room_category: 'None',
          description: 'ห้องเก็บอุปกรณ์',
          room_image: '/assets/img/404.jpg',
          room_status: 'Available',
          floor: 4,
          seat: 0,
        },

        {
          id: '431',
          room_name: '431',
          room_category: 'None',
          description: 'ห้องเก็บอุปกรณ์',
          room_image: '/assets/img/floor_4/433.jpg',
          room_status: 'Available',
          floor: 4,
          seat: 0,
        },

        {
          id: '432',
          room_name: '432',
          room_category: 'Small_Lecture_Room',
          description: 'ห้องสำหรับบรรยาย',
          room_image: '/assets/img/floor_4/433.jpg',
          room_status: 'Available',
          floor: 4,
          seat: 50,
        },

        {
          id: '433',
          room_name: '433',
          room_category: 'Small_Lecture_Room',
          description: 'ห้องสำหรับบรรยาย',
          room_image: '/assets/img/floor_4/433.jpg',
          room_status: 'Available',
          floor: 4,
          seat: 50,
        },

        {
          id: '434',
          room_name: '434',
          room_category: 'Small_Lecture_Room',
          description: 'ห้องสำหรับบรรยาย',
          room_image: '/assets/img/floor_4/434.jpg',
          room_status: 'Available',
          floor: 4,
          seat: 50,
        },

        {
          id: '435',
          room_name: '435',
          room_category: 'Small_Lecture_Room',
          description: 'ห้องสำหรับบรรยาย',
          room_image: '/assets/img/floor_4/435.jpg',
          room_status: 'Available',
          floor: 4,
          seat: 50,
        },

        {
          id: '436',
          room_name: '436',
          room_category: 'Small_Lecture_Room',
          description: 'ห้องสำหรับบรรยาย',
          room_image: '/assets/img/floor_4/435.jpg',
          room_status: 'Available',
          floor: 4,
          seat: 50,
        },

        {
          id: '437',
          room_name: 'ห้อง Artificial Intelligence Research',
          room_category: 'None',
          description: 'ห้องสำหรับบรรยาย',
          room_image: '/assets/img/404.jpg',
          room_status: 'Available',
          floor: 4,
          seat: 50,
        },

        {
          id: '438',
          room_name: '438',
          room_category: 'None',
          description: 'ห้องสำหรับบรรยาย',
          room_image: '/assets/img/404.jpg',
          room_status: 'Available',
          floor: 4,
          seat: 10,
        },
        
        {
          id: '439',
          room_name: '439',
          room_category: 'None',
          description: 'ห้องสำหรับบรรยาย',
          room_image: '/assets/img/404.jpg',
          room_status: 'Available',
          floor: 4,
          seat: 0,
        },
        // {
        //   id: '439',
        //   room_name: '439',
        //   room_category: 'None',
        //   description: 'ห้องสำหรับบรรยาย',
        //   room_image: '/assets/img/404.jpg',
        //   room_status: 'Available',
        //   floor: 4,
        //   seat: 50,
        // },

      ],
    });

    const lab_data = [
      {
        room_id: '203',
        computer_quantity: 80,
        computer_brand: 'Lenovo รุ่น ThinkCenter M70t Gen3',
        display: 'LCD Think Version E-24-29',
        cpu: 'i7-12700  2.10 GHz  12th Gen12 Intel(R)',
        ram: '16 GB',
        main_memory: '500 GB (ชนิด SSD)',
        gpu: 'Intel(R)UHD Graphics770(onboard graphics card) AND NVIDA GeForce GT730 (Graphic Card in Active)',
        operation_system: 'Windows 10 Education 64 bit Version 22H2',
        protection_system: 'Program rollback rx professional',
      },
      {
        room_id: '205',
        computer_quantity: 60,
        computer_brand: 'DELL ALL IN ONE',
        display: 'DELL ALL IN ONE',
        cpu: 'Intel(R) Core(TM) i7-3770S CPU @ 3.10GHz 3.10 GHz',
        ram: '8 GB 1600 MHz DDR3',
        main_memory: '500 GB (ชนิด SSD)',
        gpu: 'Intel(R) HD Graphics 4000',
        operation_system: 'Windows 10 Education_64 bit (22H2)',
        protection_system: 'Program Roll Back Rx',
      },
      {
        room_id: '207',
        computer_quantity: 80,
        computer_brand: 'Lenovo รุ่น ThinkCenter M70t Gen3',
        display: 'LCD Think Version E-24-29',
        cpu: 'i7-12700  2.10 GHz  12th Gen12 Intel(R)',
        ram: '16 GB',
        main_memory: '500 GB (ชนิด SSD)',
        gpu: 'Intel(R)UHD Graphics770(onboard graphics card) AND NVIDA GeForce GT730 (Graphic Card in Active)',
        operation_system: 'Windows 10 Education 64 bit Version 22H2',
        protection_system: 'Program rollback rx professional',
      },
      {
        room_id: '304',
        computer_quantity: 60,
        computer_brand: 'Lenovo รุ่น ThinkCenter M70t Gen3',
        display: 'LCD Think Version E-24-29',
        cpu: 'i7-12700  2.10 GHz  12th Gen12 Intel(R)',
        ram: '16 GB',
        main_memory: '500 GB (ชนิด SSD)',
        gpu: 'Intel(R)UHD Graphics770(onboard graphics card) AND NVIDA GeForce GT730 (Graphic Card in Active)',
        operation_system: 'Windows 10 Education 64 bit Version 22H2',
        protection_system: 'Program rollback rx professional',
      },
      {
        room_id: '306',
        computer_quantity: 47,
        computer_brand: 'HP EliteDesk 800 G5 TWR',
        display: 'HP P24h G4, 24.0" (53cm x 30cm)',
        cpu: 'CPU Intel(R) Core(TM) i5-9600 CPU @ 3.10GHz',
        ram: '16 GB',
        main_memory: 'HDD ลูกที่1 500 GB (ชนิด NVMe interface (PCIe M.2 2280), HDD ลูกที่2 2 TB',
        gpu: '',
        operation_system: 'Windows 10  64 bit',
        protection_system: 'Program rollback rx professional',
      },
      {
        room_id: '308',
        computer_quantity: 80,
        computer_brand: 'HP ProDesk',
        display: '',
        cpu: 'Core i7 2.10GHz Gen 12700',
        ram: '16 GB',
        main_memory: 'HDD ลูกที่1 500 GB ชนิด NVMe interface (PCIe M.2 2280), HDD ลูกที่2 2TB (ชนิด SATA จานบันทึก)',
        gpu: 'Intel(R)UHD Graphics770(onboard graphics card) AND NVIDA GeForce GT730 (Graphic Card in Active)',
        operation_system: 'Windows 10 Education 64 bit',
        protection_system: 'Program rollback rx professional',
      }

    ];

    // const laboratory_model = await prisma.laboratory.createMany({
    //   data: [
    //     lab_data[0],
    //     lab_data[1],
    //     lab_data[2],
    //     lab_data[3],
    //     lab_data[4],
    //     lab_data[5]
    //   ]
    // })

    const software_list = [
      { software_name: '7-Zip' },
      { software_name: 'Adobe Illustrator 2024' },
      { software_name: 'Adobe InDesign 2024' },
      { software_name: 'Adobe Lightroom Classic' },
      { software_name: 'Adobe Photoshop 2024' },
      { software_name: 'Adobe Premiere Pro 2024' },
      { software_name: 'Adobe Substance 3D Designer' },
      { software_name: 'Adobe Substance 3D Painter' },
      { software_name: 'Adobe Substance 3D Sampler' },
      { software_name: 'Adobe Substance 3D Stager' },
      { software_name: 'Anaconda 3' },
      { software_name: 'AnyDesk' },
      { software_name: 'Apeche NetBeans IDE 19' },
      { software_name: 'Arduino IDE' },
      { software_name: 'Autodesk Maya 2024' },
      { software_name: 'Cisco Packet Tracer' },
      { software_name: 'Docker Desktop' },
      { software_name: 'Docker Toolbox' },
      { software_name: 'Epic Games Launcher' },
      { software_name: 'Figma' },
      { software_name: 'Figma Agent' },
      { software_name: 'FileZilla' },
      { software_name: 'Git' },
      { software_name: 'Github Desktop' },
      { software_name: 'GNS 3' },
      { software_name: 'Greenshot' },
      { software_name: 'IBM SPSS Statistics 25' },
      { software_name: 'Marmoset Viewer' },
      { software_name: 'MATLAB R2021b' },
      { software_name: 'Microsoft Office' },
      { software_name: 'MongoDB' }, // software_list[30]
    ]

    for (const lab of lab_data) {
      for (const software of software_list) {
        await prisma.software.create({
          data: {
            software_name: software.software_name,
            laboratory: {
              connectOrCreate: {
                where: {
                  room_id: lab.room_id,
                },
                create: lab
              }
            }
          }
        })
      }
    }
    await prisma.accessories.createMany({
      data: [
        //M03
        {
          accessory_name: 'โพรเจกเตอร์ (เครื่องฉาย)',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'M03'
        },
        {
          accessory_name: 'คอมพิวเตอร์',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'M03'
        },
        {
          accessory_name: 'เก้าอี้',
          quantity: 90,
          setup_date: new Date(),
          room_id: 'M03'
        },
        {
          accessory_name: 'โต๊ะ',
          quantity: 90,
          setup_date: new Date(),
          room_id: 'M03'
        },
        {
          accessory_name: 'ไวท์บอร์ด',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'M03'
        },
        {
          accessory_name: 'ลำโพงขยายเสียง',
          quantity: 4,
          setup_date: new Date(),
          room_id: 'M03'
        },
        //M04
        {
          accessory_name: 'โพรเจกเตอร์ (เครื่องฉาย)',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'M04'
        },
        {
          accessory_name: 'คอมพิวเตอร์',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'M04'
        },
        {
          accessory_name: 'เก้าอี้',
          quantity: 90,
          setup_date: new Date(),
          room_id: 'M04'
        },
        {
          accessory_name: 'โต๊ะ',
          quantity: 90,
          setup_date: new Date(),
          room_id: 'M04'
        },
        {
          accessory_name: 'ไวท์บอร์ด',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'M04'
        },
        {
          accessory_name: 'ลำโพงขยายเสียง',
          quantity: 4,
          setup_date: new Date(),
          room_id: 'M04'
        },
        //M16
        {
          accessory_name: 'โพรเจกเตอร์ (เครื่องฉาย)',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'M16'
        },
        {
          accessory_name: 'เก้าอี้',
          quantity: 30,
          setup_date: new Date(),
          room_id: 'M16'
        },
        {
          accessory_name: 'โต๊ะ',
          quantity: 30,
          setup_date: new Date(),
          room_id: 'M16'
        },
        {
          accessory_name: 'ไวท์บอร์ด',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'M16'
        },
        {
          accessory_name: 'ลำโพงขยายเสียง',
          quantity: 2,
          setup_date: new Date(),
          room_id: 'M16'
        },
        //M17
        {
          accessory_name: 'โพรเจกเตอร์ (เครื่องฉาย)',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'M17'
        },
        {
          accessory_name: 'เก้าอี้',
          quantity: 20,
          setup_date: new Date(),
          room_id: 'M17'
        },
        {
          accessory_name: 'โต๊ะ',
          quantity: 20,
          setup_date: new Date(),
          room_id: 'M17'
        },
        {
          accessory_name: 'ไวท์บอร์ด',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'M17'
        },
        {
          accessory_name: 'ลำโพงขยายเสียง',
          quantity: 2,
          setup_date: new Date(),
          room_id: 'M17'
        },
        //M18
        {
          accessory_name: 'โพรเจกเตอร์ (เครื่องฉาย)',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'M18'
        },
        {
          accessory_name: 'เก้าอี้',
          quantity: 30,
          setup_date: new Date(),
          room_id: 'M18'
        },
        {
          accessory_name: 'โต๊ะ',
          quantity: 30,
          setup_date: new Date(),
          room_id: 'M18'
        },
        {
          accessory_name: 'ไวท์บอร์ด',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'M18'
        },
        {
          accessory_name: 'ลำโพงขยายเสียง',
          quantity: 2,
          setup_date: new Date(),
          room_id: 'M18'
        },
        //M21
        {
          accessory_name: 'โพรเจกเตอร์ (เครื่องฉาย)',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'M21'
        },
        {
          accessory_name: 'คอมพิวเตอร์',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'M21'
        },
        {
          accessory_name: 'เก้าอี้',
          quantity: 90,
          setup_date: new Date(),
          room_id: 'M21'
        },
        {
          accessory_name: 'โต๊ะ',
          quantity: 90,
          setup_date: new Date(),
          room_id: 'M21'
        },
        {
          accessory_name: 'ไวท์บอร์ด',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'M21'
        },
        {
          accessory_name: 'ลำโพงขยายเสียง',
          quantity: 4,
          setup_date: new Date(),
          room_id: 'M21'
        },
        //M22
        {
          accessory_name: 'โพรเจกเตอร์ (เครื่องฉาย)',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'M22'
        },
        {
          accessory_name: 'คอมพิวเตอร์',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'M22'
        },
        {
          accessory_name: 'เก้าอี้',
          quantity: 90,
          setup_date: new Date(),
          room_id: 'M22'
        },
        {
          accessory_name: 'โต๊ะ',
          quantity: 90,
          setup_date: new Date(),
          room_id: 'M22'
        },
        {
          accessory_name: 'ไวท์บอร์ด',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'M22'
        },
        {
          accessory_name: 'ลำโพงขยายเสียง',
          quantity: 4,
          setup_date: new Date(),
          room_id: 'M22'
        },
        //M23
        {
          accessory_name: 'โพรเจกเตอร์ (เครื่องฉาย)',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'M23'
        },
        {
          accessory_name: 'คอมพิวเตอร์',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'M23'
        },
        {
          accessory_name: 'เก้าอี้',
          quantity: 90,
          setup_date: new Date(),
          room_id: 'M23'
        },
        {
          accessory_name: 'โต๊ะ',
          quantity: 90,
          setup_date: new Date(),
          room_id: 'M23'
        },
        {
          accessory_name: 'ไวท์บอร์ด',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'M23'
        },
        {
          accessory_name: 'ลำโพงขยายเสียง',
          quantity: 4,
          setup_date: new Date(),
          room_id: 'M23'
        },
        //203
        {
          accessory_name: 'โพรเจกเตอร์ (เครื่องฉาย)',
          quantity: 1,
          setup_date: new Date(),
          room_id: '203'
        },
        {
          accessory_name: 'คอมพิวเตอร์',
          quantity: 80,
          setup_date: new Date(),
          room_id: '203'
        },
        {
          accessory_name: 'เก้าอี้',
          quantity: 80,
          setup_date: new Date(),
          room_id: '203'
        },
        {
          accessory_name: 'โต๊ะ',
          quantity: 80,
          setup_date: new Date(),
          room_id: '203'
        },
        {
          accessory_name: 'ไวท์บอร์ด',
          quantity: 1,
          setup_date: new Date(),
          room_id: '203'
        },
        {
          accessory_name: 'ลำโพงขยายเสียง',
          quantity: 4,
          setup_date: new Date(),
          room_id: '203'
        },
        //205
        {
          accessory_name: 'โพรเจกเตอร์ (เครื่องฉาย)',
          quantity: 1,
          setup_date: new Date(),
          room_id: '205'
        },
        {
          accessory_name: 'คอมพิวเตอร์',
          quantity: 60,
          setup_date: new Date(),
          room_id: '205'
        },
        {
          accessory_name: 'เก้าอี้',
          quantity: 60,
          setup_date: new Date(),
          room_id: '205'
        },
        {
          accessory_name: 'โต๊ะ',
          quantity: 60,
          setup_date: new Date(),
          room_id: '205'
        },
        {
          accessory_name: 'ไวท์บอร์ด',
          quantity: 1,
          setup_date: new Date(),
          room_id: '205'
        },
        {
          accessory_name: 'ลำโพงขยายเสียง',
          quantity: 4,
          setup_date: new Date(),
          room_id: '205'
        },
        //207
        {
          accessory_name: 'โพรเจกเตอร์ (เครื่องฉาย)',
          quantity: 1,
          setup_date: new Date(),
          room_id: '207'
        },
        {
          accessory_name: 'คอมพิวเตอร์',
          quantity: 80,
          setup_date: new Date(),
          room_id: '207'
        },
        {
          accessory_name: 'เก้าอี้',
          quantity: 80,
          setup_date: new Date(),
          room_id: '207'
        },
        {
          accessory_name: 'โต๊ะ',
          quantity: 80,
          setup_date: new Date(),
          room_id: '207'
        },
        {
          accessory_name: 'ไวท์บอร์ด',
          quantity: 1,
          setup_date: new Date(),
          room_id: '207'
        },
        {
          accessory_name: 'ลำโพงขยายเสียง',
          quantity: 4,
          setup_date: new Date(),
          room_id: '207'
        },
        //Project Base1
        {
          accessory_name: 'โพรเจกเตอร์ (เครื่องฉาย)',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'Project Base1'
        },
        {
          accessory_name: 'คอมพิวเตอร์',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'Project Base1'
        },
        {
          accessory_name: 'เก้าอี้',
          quantity: 60,
          setup_date: new Date(),
          room_id: 'Project Base1'
        },
        {
          accessory_name: 'โต๊ะ',
          quantity: 8,
          setup_date: new Date(),
          room_id: 'Project Base1'
        },
        {
          accessory_name: 'ไวท์บอร์ด',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'Project Base1'
        },
        {
          accessory_name: 'Smart Television',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'Project Base1'
        },
        {
          accessory_name: 'ลำโพงขยายเสียง',
          quantity: 6,
          setup_date: new Date(),
          room_id: 'Project Base1'
        },
        //Project Base2
        {
          accessory_name: 'โพรเจกเตอร์ (เครื่องฉาย)',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'Project Base2'
        },
        {
          accessory_name: 'คอมพิวเตอร์',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'Project Base2'
        },
        {
          accessory_name: 'เก้าอี้',
          quantity: 60,
          setup_date: new Date(),
          room_id: 'Project Base2'
        },
        {
          accessory_name: 'โต๊ะ',
          quantity: 8,
          setup_date: new Date(),
          room_id: 'Project Base2'
        },
        {
          accessory_name: 'ไวท์บอร์ด',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'Project Base2'
        },
        {
          accessory_name: 'Smart Television',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'Project Base2'
        },
        {
          accessory_name: 'ลำโพงขยายเสียง',
          quantity: 6,
          setup_date: new Date(),
          room_id: 'Project Base2'
        },
        //304
        {
          accessory_name: 'โพรเจกเตอร์ (เครื่องฉาย)',
          quantity: 1,
          setup_date: new Date(),
          room_id: '304'
        },
        {
          accessory_name: 'คอมพิวเตอร์',
          quantity: 60,
          setup_date: new Date(),
          room_id: '304'
        },
        {
          accessory_name: 'เก้าอี้',
          quantity: 60,
          setup_date: new Date(),
          room_id: '304'
        },
        {
          accessory_name: 'โต๊ะ',
          quantity: 60,
          setup_date: new Date(),
          room_id: '304'
        },
        {
          accessory_name: 'ไวท์บอร์ด',
          quantity: 1,
          setup_date: new Date(),
          room_id: '304'
        },
        {
          accessory_name: 'ลำโพงขยายเสียง',
          quantity: 6,
          setup_date: new Date(),
          room_id: '304'
        },
        //306
        {
          accessory_name: 'โพรเจกเตอร์ (เครื่องฉาย)',
          quantity: 1,
          setup_date: new Date(),
          room_id: '306'
        },
        {
          accessory_name: 'คอมพิวเตอร์',
          quantity: 47,
          setup_date: new Date(),
          room_id: '306'
        },
        {
          accessory_name: 'เก้าอี้',
          quantity: 47,
          setup_date: new Date(),
          room_id: '306'
        },
        {
          accessory_name: 'โต๊ะ',
          quantity: 47,
          setup_date: new Date(),
          room_id: '306'
        },
        {
          accessory_name: 'ไวท์บอร์ด',
          quantity: 1,
          setup_date: new Date(),
          room_id: '306'
        },
        {
          accessory_name: 'ลำโพงขยายเสียง',
          quantity: 4,
          setup_date: new Date(),
          room_id: '306'
        },
        //308
        {
          accessory_name: 'โพรเจกเตอร์ (เครื่องฉาย)',
          quantity: 1,
          setup_date: new Date(),
          room_id: '308'
        },
        {
          accessory_name: 'คอมพิวเตอร์',
          quantity: 80,
          setup_date: new Date(),
          room_id: '308'
        },
        {
          accessory_name: 'เก้าอี้',
          quantity: 80,
          setup_date: new Date(),
          room_id: '308'
        },
        {
          accessory_name: 'โต๊ะ',
          quantity: 80,
          setup_date: new Date(),
          room_id: '308'
        },
        {
          accessory_name: 'ไวท์บอร์ด',
          quantity: 1,
          setup_date: new Date(),
          room_id: '308'
        },
        {
          accessory_name: 'ลำโพงขยายเสียง',
          quantity: 6,
          setup_date: new Date(),
          room_id: '308'
        },
        //328
        {
          accessory_name: 'โพรเจกเตอร์ (เครื่องฉาย)',
          quantity: 1,
          setup_date: new Date(),
          room_id: '328'
        },
        {
          accessory_name: 'คอมพิวเตอร์',
          quantity: 1,
          setup_date: new Date(),
          room_id: '328'
        },
        {
          accessory_name: 'เก้าอี้',
          quantity: 40,
          setup_date: new Date(),
          room_id: '328'
        },
        {
          accessory_name: 'โต๊ะ',
          quantity: 40,
          setup_date: new Date(),
          room_id: '328'
        },
        {
          accessory_name: 'ไวท์บอร์ด',
          quantity: 1,
          setup_date: new Date(),
          room_id: '328'
        },
        {
          accessory_name: 'ลำโพงขยายเสียง',
          quantity: 4,
          setup_date: new Date(),
          room_id: '328'
        },
        //333
        {
          accessory_name: 'โพรเจกเตอร์ (เครื่องฉาย)',
          quantity: 1,
          setup_date: new Date(),
          room_id: '333'
        },
        {
          accessory_name: 'คอมพิวเตอร์',
          quantity: 30,
          setup_date: new Date(),
          room_id: '333'
        },
        {
          accessory_name: 'เก้าอี้',
          quantity: 30,
          setup_date: new Date(),
          room_id: '333'
        },
        {
          accessory_name: 'โต๊ะ',
          quantity: 30,
          setup_date: new Date(),
          room_id: '333'
        },
        {
          accessory_name: 'ไวท์บอร์ด',
          quantity: 1,
          setup_date: new Date(),
          room_id: '333'
        },
        {
          accessory_name: 'ลำโพงขยายเสียง',
          quantity: 4,
          setup_date: new Date(),
          room_id: '333'
        },
        //Project Base3
        {
          accessory_name: 'โพรเจกเตอร์ (เครื่องฉาย)',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'Project Base3'
        },
        {
          accessory_name: 'คอมพิวเตอร์',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'Project Base3'
        },
        {
          accessory_name: 'เก้าอี้',
          quantity: 75,
          setup_date: new Date(),
          room_id: 'Project Base3'
        },
        {
          accessory_name: 'โต๊ะ',
          quantity: 75,
          setup_date: new Date(),
          room_id: 'Project Base3'
        },
        {
          accessory_name: 'ไวท์บอร์ด',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'Project Base3'
        },
        {
          accessory_name: 'Smart Television',
          quantity: 2,
          setup_date: new Date(),
          room_id: 'Project Base3'
        },
        {
          accessory_name: 'ลำโพงขยายเสียง',
          quantity: 6,
          setup_date: new Date(),
          room_id: 'Project Base3'
        },
        //Project Base4
        {
          accessory_name: 'โพรเจกเตอร์ (เครื่องฉาย)',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'Project Base4'
        },
        {
          accessory_name: 'คอมพิวเตอร์',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'Project Base4'
        },
        {
          accessory_name: 'เก้าอี้',
          quantity: 75,
          setup_date: new Date(),
          room_id: 'Project Base4'
        },
        {
          accessory_name: 'โต๊ะ',
          quantity: 75,
          setup_date: new Date(),
          room_id: 'Project Base4'
        },
        {
          accessory_name: 'ไวท์บอร์ด',
          quantity: 1,
          setup_date: new Date(),
          room_id: 'Project Base4'
        },
        {
          accessory_name: 'Smart Television',
          quantity: 2,
          setup_date: new Date(),
          room_id: 'Project Base4'
        },
        {
          accessory_name: 'ลำโพงขยายเสียง',
          quantity: 6,
          setup_date: new Date(),
          room_id: 'Project Base4'
        },
        //403
        {
          accessory_name: 'โพรเจกเตอร์ (เครื่องฉาย)',
          quantity: 1,
          setup_date: new Date(),
          room_id: '403'
        },
        {
          accessory_name: 'คอมพิวเตอร์',
          quantity: 1,
          setup_date: new Date(),
          room_id: '403'
        },
        {
          accessory_name: 'เก้าอี้เลคเชอร์',
          quantity: 40,
          setup_date: new Date(),
          room_id: '403'
        },
        {
          accessory_name: 'ไวท์บอร์ด',
          quantity: 1,
          setup_date: new Date(),
          room_id: '403'
        },
        {
          accessory_name: 'ลำโพงขยายเสียง',
          quantity: 4,
          setup_date: new Date(),
          room_id: '403'
        },
        //404
        {
          accessory_name: 'โพรเจกเตอร์ (เครื่องฉาย)',
          quantity: 1,
          setup_date: new Date(),
          room_id: '404'
        },
        {
          accessory_name: 'คอมพิวเตอร์',
          quantity: 1,
          setup_date: new Date(),
          room_id: '404'
        },
        {
          accessory_name: 'เก้าอี้',
          quantity: 30,
          setup_date: new Date(),
          room_id: '404'
        },
        {
          accessory_name: 'โต๊ะ',
          quantity: 30,
          setup_date: new Date(),
          room_id: '404'
        },
        {
          accessory_name: 'ไวท์บอร์ด',
          quantity: 1,
          setup_date: new Date(),
          room_id: '404'
        },
        {
          accessory_name: 'ลำโพงขยายเสียง',
          quantity: 4,
          setup_date: new Date(),
          room_id: '404'
        },
        // //405
        // {
        //   accessory_name: 'โพรเจกเตอร์ (เครื่องฉาย)',
        //   quantity: 1,
        //   setup_date: new Date(),
        //   room_id: '405'
        // },
        // {
        //   accessory_name: 'คอมพิวเตอร์',
        //   quantity: 1,
        //   setup_date: new Date(),
        //   room_id: '405'
        // },
        // {
        //   accessory_name: 'เก้าอี้',
        //   quantity: 40,
        //   setup_date: new Date(),
        //   room_id: '405'
        // },
        // {
        //   accessory_name: 'โต๊ะ',
        //   quantity: 40,
        //   setup_date: new Date(),
        //   room_id: '405'
        // },
        // {
        //   accessory_name: 'ไวท์บอร์ด',
        //   quantity: 1,
        //   setup_date: new Date(),
        //   room_id: '405'
        // },
        // {
        //   accessory_name: 'ลำโพงขยายเสียง',
        //   quantity: 4,
        //   setup_date: new Date(),
        //   room_id: '405'
        // },
        //406
        {
          accessory_name: 'โพรเจกเตอร์ (เครื่องฉาย)',
          quantity: 1,
          setup_date: new Date(),
          room_id: '406'
        },
        {
          accessory_name: 'คอมพิวเตอร์',
          quantity: 1,
          setup_date: new Date(),
          room_id: '406'
        },
        {
          accessory_name: 'เก้าอี้',
          quantity: 80,
          setup_date: new Date(),
          room_id: '406'
        },
        {
          accessory_name: 'โต๊ะ',
          quantity: 55,
          setup_date: new Date(),
          room_id: '406'
        },
        {
          accessory_name: 'ไวท์บอร์ด',
          quantity: 1,
          setup_date: new Date(),
          room_id: '406'
        },
        {
          accessory_name: 'Smart Television',
          quantity: 2,
          setup_date: new Date(),
          room_id: '406'
        },
        {
          accessory_name: 'ลำโพงขยายเสียง',
          quantity: 6,
          setup_date: new Date(),
          room_id: '406'
        },
        //432
        {
          accessory_name: 'โพรเจกเตอร์ (เครื่องฉาย)',
          quantity: 1,
          setup_date: new Date(),
          room_id: '432'
        },
        {
          accessory_name: 'เก้าอี้เลคเชอร์',
          quantity: 50,
          setup_date: new Date(),
          room_id: '432'
        },
        {
          accessory_name: 'ไวท์บอร์ด',
          quantity: 1,
          setup_date: new Date(),
          room_id: '432'
        },
        {
          accessory_name: 'ลำโพงขยายเสียง',
          quantity: 2,
          setup_date: new Date(),
          room_id: '432'
        },
        //433
        {
          accessory_name: 'โพรเจกเตอร์ (เครื่องฉาย)',
          quantity: 1,
          setup_date: new Date(),
          room_id: '433'
        },
        {
          accessory_name: 'เก้าอี้เลคเชอร์',
          quantity: 50,
          setup_date: new Date(),
          room_id: '433'
        },
        {
          accessory_name: 'ไวท์บอร์ด',
          quantity: 1,
          setup_date: new Date(),
          room_id: '433'
        },
        {
          accessory_name: 'ลำโพงขยายเสียง',
          quantity: 2,
          setup_date: new Date(),
          room_id: '433'
        },
        //434
        {
          accessory_name: 'โพรเจกเตอร์ (เครื่องฉาย)',
          quantity: 1,
          setup_date: new Date(),
          room_id: '434'
        },
        {
          accessory_name: 'เก้าอี้เลคเชอร์',
          quantity: 50,
          setup_date: new Date(),
          room_id: '434'
        },
        {
          accessory_name: 'ไวท์บอร์ด',
          quantity: 1,
          setup_date: new Date(),
          room_id: '434'
        },
        {
          accessory_name: 'ลำโพงขยายเสียง',
          quantity: 2,
          setup_date: new Date(),
          room_id: '434'
        },
        //435
        {
          accessory_name: 'โพรเจกเตอร์ (เครื่องฉาย)',
          quantity: 1,
          setup_date: new Date(),
          room_id: '435'
        },
        {
          accessory_name: 'เก้าอี้เลคเชอร์',
          quantity: 50,
          setup_date: new Date(),
          room_id: '435'
        },
        {
          accessory_name: 'ไวท์บอร์ด',
          quantity: 1,
          setup_date: new Date(),
          room_id: '435'
        },
        {
          accessory_name: 'ลำโพงขยายเสียง',
          quantity: 2,
          setup_date: new Date(),
          room_id: '435'
        },
        //436
        {
          accessory_name: 'โพรเจกเตอร์ (เครื่องฉาย)',
          quantity: 1,
          setup_date: new Date(),
          room_id: '436'
        },
        {
          accessory_name: 'เก้าอี้เลคเชอร์',
          quantity: 50,
          setup_date: new Date(),
          room_id: '436'
        },
        {
          accessory_name: 'ไวท์บอร์ด',
          quantity: 1,
          setup_date: new Date(),
          room_id: '436'
        },
        {
          accessory_name: 'ลำโพงขยายเสียง',
          quantity: 2,
          setup_date: new Date(),
          room_id: '436'
        },
      ],
    });

    console.log('Data seeding completed.');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedData();
