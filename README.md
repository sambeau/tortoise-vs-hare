# tortoise-vs-hare

Tortoise v Hare, a Monte-Carlo Board Game Design

![Tortoise v Hare](images/tvh.png)

## Idea

I was interested in the idea of creating a board game with a fundamental imbalance and wondered whether I could use a [Monte Carlo simulation](https://en.wikipedia.org/wiki/Monte_Carlo_method) to tweak it until it was balanced. I chose the idea of the Tortoise vs the Hare, a simple ["Game of the Goose"](https://en.wikipedia.org/wiki/Game_of_the_Goose) race game concept where players race counters (one tortoise, one hare) on a path of squares, and the initial assumption that the tortoise would only roll one die while the hare would roll two. I also wanted the game mechanics to be simple enough for kids to play by themselves.

## Tweaks

My first thought was that the Hare would have to take naps. If he napped every time he rolled a double and then woke up again every time he rolled another, would that be enough to balance the game? My second thought was, could the tortoise have a jet-pack, like he does in the Bugs Bunny cartoons? How would that work?

I simulated the basic game mechanics with a simple javascript program and ran it 1,000,000 times counting the number of times the hare won, the number of times the tortoise won, and the number of draws where both animals arrived on the finish line on the same turn (e.g., the tenth roll of both players).

Then I added naps for the hare, then a jetpack for the tortoise. Then I had to make the jet-pack very unreliable.

Various interesting game mechanics fell out of this after each run. Lots of ideas had to be abandoned. Each time I would balance the mechanism and then introduce another idea and repeat the balance process.

I soon had the following balanced rules:

![Tortoise has a jet pack](images/jet.png)

### Tortoise

-   Rolls one die
-   Starts flying if they roll a 6
-   When flying, their die roll is doubled
-   Breaks down again if they roll a 1

![Hare falls asleep](images/sleep.png)

### Hare

-   Rolls two dice
-   Falls asleep if the player rolls a double
-   Doesn't move until they wake again
-   Wakes from sleep if they roll an even number on a single die

## The board

Finally I simulated a board with various special squares: miss a turn, roll again, etc. I placed the squares in random places and ran the tests millions of times. I discovered that just as important as the special squares and their placement was the overall length of the board. Adding or removing a square could make a crucial difference.

In the end I ended up with the following special squares:

-   Miss a turn (MT)
-   Roll again (RA)
-   Forward 3 squares (F3)
-   Back 3 squares (B3)
-   Tortoise crashes if flying (CR)
-   Hare falls asleep, presumably due to a field of carrots (zz)

I ended up with a board with 79 squares. I was looking for a game with around 10-12 rolls for each player and I wanted a typical game to include at least one sleep for the hare and one jet run for the tortoise. The 79-square board worked out the most balanced in all areas.

I also ended up with 3 sleep squares for the hare and two crash squares for the tortoise.

## Results

First we test the rules:

| Result | n | % |
|:--|--:|--:|
| hare wins | 460,511 | 46% |
| tortoise wins | 460,014 | 46% |
| draws | 79,475 | 7% |

A minuscule edge for the hare but still orders less than the possibility of a draw. Close enough for me!

It will be interesting to see which is more fun to play, the tortoise or the hare. I suspect younger players will look at the dice and and go for the hare, while older players will look at the number of sleeps vs crash squares on the board and go for the tortoise. But as we know, the playing field is *very* even.

Next we look for a balanced board:

| Result | n | % |
|:--|--:|--:|
| hare wins | 42,900,614 | 46.6% |
| tortoise wins | 42,871,281 | 46.6% |
| draws | 6,296,895 | 6.8% |

The final board I found looks like great fun. That back three just before the finish line is brutal and hilarious. I like the clear run at the start. Those two back threes straight after seem brutal, but I guess they could be made into something fun on the board — hills, brambles or maybe a swamp. Plus, the clump of forward threes near the beginning of the end balances it out.  I like the way that the sleeps and crashes come near the middle game. The clump of back three, roll again, miss a turn would be a fun hurdle — hitting that middle square would be fun. Similarly, if the rabbit hits the sleep next to the two forward threes, he’s never going to hit one. No doubt the tortoise will go plodding past. I also really like that the two final squares are one crash, one sleep — just enough danger right at the end. I don’t think I could have designed a better one if the only outcome was fun.

This was, of course, one random run. If you try it, you will get different results each time. 

But, I couldn’t be happier with this run.

	spaces: 79 fly-speed: 2
	sims: 1000000
	t: 460014 h: 460511 d: 79475
	hare wins: 46%
	tortoise wins: 46%
	draws: 7%
	ave turns: 12.54
	ave sleeps: 1.64
	ave flights: 1.49
	
	
	 79474
	6296895
	{ d: 6296895, t: 42871281, h: 42900614 }
	[
	  'empty', 'empty', 'empty', 'empty', 'empty', 'empty',
	  'empty', 'empty', 'empty', 'empty', 'b3',    'b3',
	  'empty', 'empty', 'f3',    'empty', 'ra',    'empty',
	  'empty', 'empty', 'empty', 'empty', 'b3',    'ra',
	  'mt',    'empty', 'empty', 'empty', 'empty', 'mt',
	  'empty', 'empty', 'empty', 'zz',    'empty', 'empty',
	  'empty', 'empty', 'empty', 'ra',    'empty', 'empty',
	  'cr',    'empty', 'empty', 'empty', 'mt',    'empty',
	  'empty', 'b3',    'empty', 'f3',    'empty', 'empty',
	  'empty', 'empty', 'empty', 'empty', 'empty', 'empty',
	  'empty', 'zz',    'f3',    'f3',    'empty', 'empty',
	  'empty', 'empty', 'f3',    'empty', 'empty', 'empty',
	  'empty', 'zz',    'empty', 'cr',    'empty', 'empty',
	  'b3'
	]

## Presentation

I've included the slides for a 5-minute presentation I gave about it.

## Thoughts

I'd love to have automated the trail-and-error process of deciding the constants chosen for each run, maybe with another layer of Monte Carlo randomly tweaking them or even a genetic algorithm.

I'd also like to try this with a more complicated adult board game.

Sadly, I still haven’t made a physical board and play-tested it for real. I really, really should. If anyone out there does, please let me know.

Finally, if any games company out there fancies producing it for real, get in touch. I think it would be a great little game for the under 10s market. With two cute counters and a pretty board I’d like to think it could be a hit. But, frankly, I what do I know, I guess there’s way more to a successful game than a set of balanced rules.