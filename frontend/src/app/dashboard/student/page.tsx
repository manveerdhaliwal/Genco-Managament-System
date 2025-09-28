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
          <UserCard type="Upcoming events" value={0} />
          <UserCard type="Certificates Achieved" value={3} />
          <UserCard type="active projects" value={2} />
          <UserCard type="duty leaves" value="2 Pending" />
        </div>

    
        <Carousel className="w-full p-10 relative">
          <CarouselContent>
            {/* Slide 1: Student Info */}
            <CarouselItem className="p-4">
  <div className="rounded-xl h-80 flex items-center justify-center w-full overflow-hidden">
    <img
      src="/gndec1.jpeg"
      alt="Slide 1"
      className="w-full h-full object-cover rounded-xl"
    />
  </div>
</CarouselItem>

{/* Slide 2 */}
<CarouselItem className="p-4">
  <div className="rounded-xl h-80 flex items-center justify-center w-full overflow-hidden">
    <img
      src="/gndec2.jpeg"
      alt="Slide 2"
      className="w-full h-full object-cover rounded-xl"
    />
  </div>
</CarouselItem>

{/* Slide 3 */}
<CarouselItem className="p-4">
  <div className="rounded-xl h-80 flex items-center justify-center w-full overflow-hidden">
    <img
      src="/gndec3.jpg"
      alt="Slide 3"
      className="w-full h-full object-cover rounded-xl"
    />
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
