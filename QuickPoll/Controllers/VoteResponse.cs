namespace QuickPoll.Controllers
{
    public partial class PollsController
    {
        public class VoteResponse
        {
            public Guid OptionId { get; set; }
            public Guid PollId { get; set; }
            public int CurrentVotes { get; set; }
            public int TotalVotesInPoll { get; set; }
        }
    }
}