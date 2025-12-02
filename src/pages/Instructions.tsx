import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { instructionData } from '@/data/instructionData';

const Instructions = () => {
  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">Application Instructions</h1>

      <div className="space-y-8">

        {/* Introduction */}
        <section className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">
            Welcome to the Basketball Simulation Application. This guide covers everything from starting a game to deep statistical analysis.
          </p>
        </section>

        <Separator />

        {/* Getting Started */}
        <section id="getting-started">
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <Card>
            <CardHeader>
              <CardTitle>Starting the Simulation</CardTitle>
            </CardHeader>
            <CardContent>
              {instructionData.gettingStarted}
            </CardContent>
          </Card>
        </section>

        {/* Single Game Version */}
        <section id="single-game">
          <h2 className="text-2xl font-semibold mb-4">Single Game Version</h2>
          <Card>
            <CardHeader>
              <CardTitle>Playing a Single Game</CardTitle>
            </CardHeader>
            <CardContent>
              {instructionData.singleGame}
            </CardContent>
          </Card>
        </section>

        {/* Full Season Version */}
        <section id="full-season">
          <h2 className="text-2xl font-semibold mb-4">Full Season Simulation</h2>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {instructionData.fullSeason}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Simulation Modes</CardTitle>
            </CardHeader>
            <CardContent>
              {instructionData.fullSeasonModes}
            </CardContent>
          </Card>
        </section>

        {/* Statistics Definitions */}
        <section id="statistics">
          <h2 className="text-2xl font-semibold mb-4">Statistics Definitions</h2>
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Player Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                {instructionData.playerStats}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Box Scores</CardTitle>
              </CardHeader>
              <CardContent>
                {instructionData.boxScores}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Final Season Statistics (Raw Stats)</CardTitle>
              </CardHeader>
              <CardContent>
                {instructionData.finalStats}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Draft of Players */}
        <section id="drafting-players">
          <h2 className="text-2xl font-semibold mb-4">Drafting Players</h2>
          <Card>
            <CardHeader>
              <CardTitle>Roster Management</CardTitle>
            </CardHeader>
            <CardContent>
              {instructionData.draftingPlayers}
            </CardContent>
          </Card>
        </section>

        {/* Substitution Pattern */}
        <section id="substitution-pattern">
          <h2 className="text-2xl font-semibold mb-4">Substitution Pattern</h2>
          <Card>
            <CardHeader>
              <CardTitle>4-Minute Interval Strategy</CardTitle>
            </CardHeader>
            <CardContent>
              {instructionData.substitutionPattern}
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
};

export default Instructions;