namespace QuickPoll.Controllers
{
    public partial class PollsController
    {
        public class VoteRequest
        {
            public Guid OptionId { get; set; }
        }
    }
}