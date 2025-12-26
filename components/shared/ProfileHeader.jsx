// components/ProfileHeader.jsx
import CountUp from 'react-countup'; // Library for the "jaw-dropping" number animation

const ProfileHeader = ({ userStats }) => {
  return (
    <div className="relative w-full h-64 bg-gradient-to-r from-purple-900 to-violet-600 rounded-3xl p-8 text-white overflow-hidden mb-12">
      {/* Decorative background element */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
      
      <div className="flex flex-col md:flex-row justify-between items-end h-full relative z-10">
        <div className="flex gap-6 items-center">
          <div className="w-24 h-24 rounded-2xl border-4 border-white/20 overflow-hidden">
             <img src={userStats.avatar} alt="Profile" className="object-cover w-full h-full" />
          </div>
          <div>
            <h1 className="text-3xl font-black">{userStats.name}</h1>
            <p className="text-purple-200">Member since {userStats.joinDate}</p>
          </div>
        </div>

        <div className="flex gap-12 mt-6 md:mt-0 bg-black/20 backdrop-blur-md p-6 rounded-2xl border border-white/10">
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest text-purple-200">Events</p>
            <span className="text-2xl font-bold"><CountUp end={userStats.eventCount} /></span>
          </div>
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest text-purple-200">Revenue</p>
            <span className="text-2xl font-bold">$<CountUp end={userStats.totalRevenue} /></span>
          </div>
        </div>
      </div>
    </div>
  );
};