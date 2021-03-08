import math


class Player:
    def __init__(self, name: str, rating=1500, n_games=0):
        self.name = name
        self.rating = rating
        self.Q = pow(100, rating/400)
        self.n_games = 0

    def match(self, opponent, winner):
        EA = self.Q / (self.Q + opponent.Q)
        EB = opponent.Q / (self.Q + opponent.Q)
        K = 16 if self.rating > 2400 else (24 if self.rating > 2100 else 32)

        if winner == self.name:
            self.rating += K * (1 - EA)
            opponent.rating += K * (0 - EB)
        else:
            self.rating += K * (0 - EA)
            opponent.rating += K * (1 - EB)

        print(self.name, ":", self.rating)
        print(opponent.name, ":", opponent.rating)


A = Player('A')
B = Player('B')
C = Player('C')
D = Player('D')

A.match(B, 'A')
A.match(C, 'C')
D.match(B, 'D')
