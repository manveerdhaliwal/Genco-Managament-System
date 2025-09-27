import Image from "next/image";

interface UserCardProps {
  type: string;
  value: string | number;
  year?: string;
  bgColor?: string; 
}

const UserCard = ({ type, value, year = "2025/26", bgColor }: UserCardProps) => {
  return (
    <div
      className={`rounded-2xl p-4 flex-1 min-w-[130px] ${
        bgColor ? bgColor : "odd:bg-MyPurple even:bg-MyYellow"
      }`}
    >
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          {year}
        </span>
        <Image src="/more.png" alt="options" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4">{value}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">{type}</h2>
    </div>
  );
};

export default UserCard;
