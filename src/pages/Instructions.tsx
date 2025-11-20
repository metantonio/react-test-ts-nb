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
            Welcome to the Basketball Simulation Application. This guide will help you navigate through the Game Setup,
            Full Season Simulation, Player Drafting, and Substitution Patterns.
          </p>
        </section>

        <Separator />

        {/* Game Setup */}
        <section id="game-setup">
          <h2 className="text-2xl font-semibold mb-4">Game Setup</h2>
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
            </CardHeader>
            <CardContent>
              {instructionData.gameSetup}
            </CardContent>
          </Card>
        </section>

        {/* Full Season Version */}
        <section id="full-season">
          <h2 className="text-2xl font-semibold mb-4">Full Season Simulation</h2>
          <Card>
            <CardHeader>
              <CardTitle>Managing the Season</CardTitle>
            </CardHeader>
            <CardContent>
              {instructionData.fullSeason}
            </CardContent>
          </Card>
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

        {/* 4 Minute Substitution Pattern */}
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