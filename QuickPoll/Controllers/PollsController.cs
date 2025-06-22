using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuickPoll.Data;
using QuickPoll.Models;
using QuickPoll.Models.DTOs;


namespace QuickPoll.Controllers
{
    [ApiController]
    [Route("api/polls")]
    public class PollsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public PollsController(AppDbContext db) => _db = db;

        //Создание опроса
        [HttpPost]
        public async Task<IActionResult> CreatePoll([FromBody] CreatePollRequest request)
        {
            if (string.IsNullOrEmpty(request.Question))
                return BadRequest("Question is required");

            if (request.Options == null || !request.Options.Any())
                return BadRequest("At least one option is required");

            var poll = new Poll { Question = request.Question };
            poll.Options = request.Options.Select(o => new Option
            {
                Text = o,
                PollId = poll.Id  // Устанавливаем связь
            }).ToList();

            await _db.Polls.AddAsync(poll);
            await _db.SaveChangesAsync();

            return Ok(new { poll.Id });
        }
        //Получение статистики
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPoll(Guid id)
        {
            var poll = await _db.Polls
                .Include(p => p.Options)
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == id);

            if (poll == null) return NotFound("Опрос не найден");

            var pollDTO = new PollDTO
            {
                Id = poll.Id,
                Question = poll.Question,
                Options = poll.Options.Select(o => new OptionDTO
                {
                    Id = o.Id,
                    Text = o.Text,
                    Votes = o.Votes
                }).ToList()
            };

            return Ok(pollDTO);
        }

        //Голосование 
        [HttpPost("{pollId}/vote")]
        public async Task<IActionResult> Vote(Guid pollId, [FromBody] VoteRequest request)
        {
            // Валидация
            if (pollId == Guid.Empty || request?.OptionId == Guid.Empty)
            {
                return BadRequest("Некорректные идентификаторы опроса или варианта.");
            }

            // Поиск опроса и варианта
            var option = await _db.Options
                .Include(o => o.Poll) // Подгружаем опрос для информации в ответе
                .FirstOrDefaultAsync(o => o.Id == request.OptionId && o.PollId == pollId);

            if (option == null)
            {
                return NotFound("Вариант не найден или не относится к этому опросу.");
            }

            // Голосование
            option.Votes++;
            await _db.SaveChangesAsync();

            // Возвращаем актуальные данные для обновления UI
            return Ok(new VoteResponse
            {
                OptionId = option.Id,
                PollId = pollId,
                CurrentVotes = option.Votes,
                TotalVotesInPoll = await _db.Options
                    .Where(o => o.PollId == pollId)
                    .SumAsync(o => o.Votes) // Общее число голосов в опросе
            });
        }


        public class CreatePollRequest
        {
            public string Question { get; set; }
            public List<string> Options { get; set; }
        }

        public class VoteRequest
        {
            public Guid OptionId { get; set; }
        }

        public class VoteResponse
        {
            public Guid OptionId { get; set; }
            public Guid PollId { get; set; }
            public int CurrentVotes { get; set; }
            public int TotalVotesInPoll { get; set; }
        }
    }
}