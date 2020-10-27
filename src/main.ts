import express from 'express';
import { Client, query } from 'faunadb';

const { Collection, Index, Match } = query;