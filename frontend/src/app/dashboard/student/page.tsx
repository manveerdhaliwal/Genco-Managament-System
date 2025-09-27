import EventCalendar from "@/components/EventCalendar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import UserCard from "@/components/UserCard";

const StudentPage = () => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="attendance" value="80%" />
          <UserCard type="upcoming events" value={3} />
          <UserCard type="active projects" value={2} />
          <UserCard type="duty leaves" value="2 Pending" />
        </div>

    
        <Carousel className="w-full p-10 relative">
          <CarouselContent>
            {/* Slide 1: Student Info */}
            <CarouselItem className="p-4">
              <div className="bg-blue-100 shadow-md rounded-xl h-80 flex flex-col items-center justify-center gap-4 w-full p-6 border border-gray-200">
                <p className="text-xl font-bold">Slide 1</p>
              </div>
            </CarouselItem>
           

            {/* Slide 2 */}
            <CarouselItem className="p-4">
              <div className="bg-pink-100 rounded-xl h-80 flex items-center justify-center w-full">
                <p className="text-xl font-bold">Slide 2</p>
              </div>
            </CarouselItem>

            {/* Slide 3 */}
            <CarouselItem className="p-4">
              <div className="bg-green-100 rounded-xl h-80 flex items-center justify-center w-full">
                <p className="text-xl font-bold">Slide 3</p>
              </div>
            </CarouselItem>
          </CarouselContent>

          {/* Buttons */}
          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
        </Carousel>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
      </div>
    </div>
  );
};

export default StudentPage;
