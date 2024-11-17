// import { Inter } from 'next/font/google';// Import the CalendarSwitchButton
import { redirect } from 'next/navigation';

// const inter = Inter({ subsets: ['latin'] });

const homePage = () => {

  return redirect("/transactions");
}

export default homePage;
