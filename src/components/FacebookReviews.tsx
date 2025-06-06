import { useState, useEffect } from "react";
import { ThumbsUp, MessageCircle, ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

// Define a review type
type Review = {
  name: string;
  avatar: string;
  time: string;
  text: string;
  likes: number;
  comments: number;
};

// Define sort types
type SortOption = "newest" | "most-likes" | "most-comments";

// Define fallback image to use when image loading fails
const FALLBACK_IMAGE = "/lovable-uploads/cbdedd35-0ec9-4e16-8866-51e309907ad3.png";
const FacebookReviews = () => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [displayedReviewsData, setDisplayedReviewsData] = useState<Review[]>([]);
  // Store which reviews will have replies (3 random ones instead of 5)
  const [reviewsWithReplies, setReviewsWithReplies] = useState<number[]>([]);
  
  // Preload fallback image
  useEffect(() => {
    const img = new Image();
    img.src = FALLBACK_IMAGE;
  }, []);

  // Define all reviews in one array for Sainsbury's Review Program
  const allReviews: Review[] = [{
    name: "Sarah Johnson",
    avatar: "https://i.pravatar.cc/40?img=1",
    time: "2 hours ago",
    text: "Just received my £750 Sainsbury's gift card! The survey was super easy and the card arrived quickly. So happy with this program!",
    likes: 24,
    comments: 2
  }, {
    name: "Michael Thomas",
    avatar: "https://i.pravatar.cc/40?img=5",
    time: "Yesterday",
    text: "This is legit! Was skeptical at first but decided to try anyway. Got my £750 Sainsbury's gift card in just 3 days after completing the survey. Amazing service!",
    likes: 42,
    comments: 5
  }, {
    name: "Jessica Williams",
    avatar: "https://i.pravatar.cc/40?img=8",
    time: "2 days ago",
    text: "Just wow! Survey took less than 5 minutes and the £750 gift card arrived perfectly packaged. My weekly shop at Sainsbury's is sorted for months!",
    likes: 19,
    comments: 1
  }, {
    name: "Robert Chen",
    avatar: "https://i.pravatar.cc/40?img=12",
    time: "3 days ago",
    text: "The whole process was surprisingly simple. I completed the survey during lunch break and received confirmation immediately. £750 gift card arrived few days later. 10/10 would recommend!",
    likes: 38,
    comments: 3
  }, {
    name: "Amanda Rodriguez",
    avatar: "https://i.pravatar.cc/40?img=22",
    time: "Last week",
    text: "Best decision ever! My £750 Sainsbury's gift card arrived in perfect condition. The Sainsbury's Review Program is amazing - thank you so much!",
    likes: 57,
    comments: 7
  },
  // Adding text-only reviews 
  {
    name: "Emma Peterson",
    avatar: "https://i.pravatar.cc/40?img=3",
    time: "4 days ago",
    text: "Thought it was too good to be true, but I'm literally using my £750 Sainsbury's gift card today! Perfect timing as I needed to stock up on shopping for months.",
    likes: 21,
    comments: 3
  }, {
    name: "Liam Johnson",
    avatar: "https://i.pravatar.cc/40?img=10",
    time: "5 days ago",
    text: "So grateful for this opportunity! My family's shopping budget was tight this month. The survey was straightforward and my £750 gift card came in the mail just 4 days later.",
    likes: 17,
    comments: 2
  }, {
    name: "Olivia Rodriguez",
    avatar: "https://i.pravatar.cc/40?img=16",
    time: "Last week",
    text: "My friends didn't believe me when I told them about this program, but now they're all signing up after seeing my £750 Sainsbury's gift card! Definitely worth the few minutes it takes.",
    likes: 29,
    comments: 5
  }, {
    name: "Noah Martinez",
    avatar: "https://i.pravatar.cc/40?img=20",
    time: "Last week",
    text: "Just got my £750 Sainsbury's gift card yesterday. Already used £50 of it for my shopping today. Such a helpful boost to the monthly budget!",
    likes: 15,
    comments: 1
  }, {
    name: "Ava Thompson",
    avatar: "https://i.pravatar.cc/40?img=23",
    time: "2 weeks ago",
    text: "After some unexpected bills, our shopping budget was tight. This £750 Sainsbury's gift card program was a lifesaver! So quick and easy to participate.",
    likes: 33,
    comments: 4
  }, {
    name: "Ethan Wright",
    avatar: "https://i.pravatar.cc/40?img=33",
    time: "3 weeks ago",
    text: "I was hesitant but decided to try it anyway. So glad I did! The whole process was smooth and I got my £750 Sainsbury's gift card right on time as promised.",
    likes: 41,
    comments: 6
  }];

  useEffect(() => {
    // Initialize reviews sorted by newest on first load
    const timeOrder = convertTimeStringsToOrder(allReviews);
    setDisplayedReviewsData([...allReviews].sort((a, b) => timeOrder[b.time] - timeOrder[a.time]));

    // Randomly select 3 reviews to have replies
    const randomReviews = getRandomIndices(allReviews.length, 3);
    setReviewsWithReplies(randomReviews);
  }, []);

  // Helper function to get random indices
  const getRandomIndices = (max: number, count: number): number[] => {
    const indices: number[] = [];
    while (indices.length < count) {
      const randomIndex = Math.floor(Math.random() * max);
      if (!indices.includes(randomIndex)) {
        indices.push(randomIndex);
      }
    }
    return indices;
  };

  // Helper function to convert time strings to numeric values for sorting
  const convertTimeStringsToOrder = (reviews: Review[]) => {
    const timeOrder: {
      [key: string]: number;
    } = {};
    const timeValues = {
      "hour": 60,
      "hours": 60,
      "day": 24 * 60,
      "days": 24 * 60,
      "week": 7 * 24 * 60,
      "weeks": 7 * 24 * 60
    };
    reviews.forEach(review => {
      const timeParts = review.time.split(" ");
      if (timeParts.length >= 2) {
        const number = parseInt(timeParts[0]);
        const unit = timeParts[1];
        if (unit === "ago") {
          // Handle "2 hours ago" format
          const actualUnit = timeParts[1];
          if (actualUnit in timeValues) {
            timeOrder[review.time] = number * timeValues[actualUnit];
          }
        } else if (unit === "hour" || unit === "hours" || unit === "day" || unit === "days" || unit === "week" || unit === "weeks") {
          // Handle "2 hours ago", "Yesterday", etc.
          timeOrder[review.time] = number * timeValues[unit];
        } else if (timeParts[0] === "Yesterday") {
          timeOrder[review.time] = 1 * timeValues["day"];
        } else if (timeParts[0] === "Last") {
          timeOrder[review.time] = 1 * timeValues[timeParts[1]];
        }
      }
    });
    return timeOrder;
  };

  const refreshComments = () => {
    // Set sort option to newest and sort reviews by newest
    setSortOption("newest");
    const timeOrder = convertTimeStringsToOrder(allReviews);
    setDisplayedReviewsData([...allReviews].sort((a, b) => timeOrder[b.time] - timeOrder[a.time]));

    // Get new random reviews with replies when refreshing
    const randomReviews = getRandomIndices(allReviews.length, 3);
    setReviewsWithReplies(randomReviews);
  };

  // Handle image error event
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = FALLBACK_IMAGE;
  };

  // Sort the reviews based on the selected option
  const getSortedReviews = () => {
    switch (sortOption) {
      case "most-likes":
        return [...displayedReviewsData].sort((a, b) => b.likes - a.likes);
      case "most-comments":
        return [...displayedReviewsData].sort((a, b) => b.comments - a.comments);
      case "newest":
      default:
        // Sort by time strings converted to relative minutes
        const timeOrder = convertTimeStringsToOrder(displayedReviewsData);
        return [...displayedReviewsData].sort((a, b) => timeOrder[a.time] !== undefined && timeOrder[b.time] !== undefined ? timeOrder[a.time] - timeOrder[b.time] : 0);
    }
  };

  const sortedReviews = getSortedReviews();
  const displayedReviews = showAllReviews ? sortedReviews : sortedReviews.slice(0, 5);

  // Get a unique response for a specific review
  const getUniqueResponse = (index: number, reviewName: string) => {
    const responses = [
      `Thanks for sharing your experience, ${reviewName}! 😊 We're thrilled you're enjoying your £750 Sainsbury's gift card. Our team works hard to make shipping as fast as possible!`,
      `We really appreciate your feedback, ${reviewName}! The £750 Sainsbury's gift card is a great way to save on your shopping, and we're delighted it arrived in perfect condition.`,
      `Thank you so much for your kind words, ${reviewName}! We're committed to making this program accessible to everyone who qualifies. Enjoy your shopping at Sainsbury's!`,
      `We're so glad to hear about your positive experience, ${reviewName}! Our goal is to make the survey process as simple as possible. Thank you for being part of our program!`,
      `Your satisfaction means everything to us, ${reviewName}! We're happy that the £750 Sainsbury's gift card meets your expectations. Don't hesitate to reach out if you have any questions!`,
      `Thanks for trusting our program, ${reviewName}! Many people are skeptical at first, but we're dedicated to delivering gift cards to all our qualified participants.`,
      `We love hearing success stories like yours, ${reviewName}! The £750 Sainsbury's gift card can really help with household shopping expenses. Thanks for sharing your experience with our community!`,
      `Thank you for your wonderful feedback, ${reviewName}! We're glad the process was smooth and you're enjoying your gift card. That's exactly what we aim for!`
    ];

    // Use modulo to cycle through responses if there are more reviews than responses
    return responses[index % responses.length];
  };

  // Get a random time string for replies
  const getRandomTime = (index: number): string => {
    const times = ['1h ago', '3h ago', '5h ago', '1d ago', '2d ago', '3d ago'];
    return times[index % times.length];
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {/* Improved Facebook logo for mobile */}
          <div className="min-w-8 h-8 bg-[#3b5998] rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">f</span>
          </div>
          <span className="ml-2 font-semibold text-[#3b5998] text-sm sm:text-base">Read what others say about our program:</span>
        </div>
        <span className="text-sm text-gray-600 font-medium">134 comments</span>
      </div>

      <div className="flex items-center justify-between mb-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="text-sm text-gray-500 flex items-center">
            Sort by: {sortOption === "newest" ? "Newest" : sortOption === "most-likes" ? "Highest Liked" : "Most Comments"}
            <ChevronDown className="w-3 h-3 ml-1" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSortOption("newest")}>
              Newest
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOption("most-likes")}>
              Highest Liked
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOption("most-comments")}>
              Most Comments
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Changed to refresh and sort by newest */}
        <button onClick={refreshComments} className="text-sm text-orange-600 hover:underline">
          Show Newest Comments
        </button>
      </div>

      <Separator className="mb-4" />

      {/* Display sorted reviews */}
      {displayedReviews.map((review, index) => (
        <div className="mb-4" key={index}>
          <div className="flex items-start">
            <img 
              src={review.avatar} 
              alt="User" 
              className="w-8 h-8 rounded-full mr-2" 
              loading="eager" 
              onError={handleImageError} 
              width="32" 
              height="32"
            />
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-semibold text-sm">{review.name}</h4>
                <span className="text-xs text-gray-500">{review.time}</span>
              </div>
              <p className="text-sm mt-1">{review.text}</p>
              
              <div className="flex items-center mt-1 text-xs text-gray-500">
                <ThumbsUp className="w-3 h-3 mr-1" /> {review.likes}
                <MessageCircle className="w-3 h-3 ml-3 mr-1" /> {review.comments}
              </div>
            </div>
          </div>
          
          {/* Sainsbury's Review Program Replies - only show for randomly selected reviews */}
          {reviewsWithReplies.includes(index) && (
            <div className="ml-10 mt-2 border-l-2 border-gray-200 pl-3">
              <div className="flex items-start">
                {/* Fixed avatar and online icon positioning */}
                <div className="relative mr-2 flex-shrink-0">
                  <Avatar className="w-6 h-6">
                    <AvatarImage 
                      src="/lovable-uploads/cbdedd35-0ec9-4e16-8866-51e309907ad3.png" 
                      alt="Sainsbury's Review Program" 
                      loading="eager" 
                      fetchPriority="high"
                      width="24"
                      height="24" 
                    />
                    <AvatarFallback>SRP</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 rounded-full w-2 h-2 border border-white"></div>
                </div>
                <div className="flex-1 min-w-0"> {/* Added min-width to prevent text overflow */}
                  <div className="flex flex-wrap items-center gap-1">
                    <h5 className="text-xs font-semibold text-[#3b5998]">Sainsbury's Review Program</h5>
                    <span className="text-[10px] bg-orange-100 text-orange-800 px-1 rounded inline-block">Verified</span>
                  </div>
                  <p className="text-xs mt-0.5">
                    {getUniqueResponse(index, review.name.split(" ")[0])}
                  </p>
                  <div className="flex items-center mt-1 text-[10px] text-gray-500">
                    <span>Like</span>
                    <span className="mx-1.5">·</span>
                    <span>Reply</span>
                    <span className="mx-1.5">·</span>
                    <span>{getRandomTime(index)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Show more link */}
      <div className="text-center mt-2">
        <button className="text-orange-600 text-sm font-semibold" onClick={() => setShowAllReviews(!showAllReviews)}>
          {showAllReviews ? 'Show less reviews' : 'Show more reviews'}
        </button>
      </div>
    </div>
  );
};

export default FacebookReviews;
