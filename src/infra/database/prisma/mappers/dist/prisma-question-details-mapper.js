"use strict";
exports.__esModule = true;
exports.PrismaQuestionDetailsMapper = void 0;
var comment_with_author_1 = require("@/domain/forum/enterprise/entities/value-objects/comment-with-author");
var unique_entity_id_1 = require("@/core/entities/unique-entity-id");
var PrismaQuestionDetailsMapper = /** @class */ (function () {
    function PrismaQuestionDetailsMapper() {
    }
    PrismaQuestionDetailsMapper.toDomain = function (raw) {
        return comment_with_author_1.CommentWithAuthor.create({
            commentId: new unique_entity_id_1.UniqueEntityID(raw.id),
            authorId: new unique_entity_id_1.UniqueEntityID(raw.authorId),
            author: raw.author.name,
            content: raw.content,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        });
    };
    return PrismaQuestionDetailsMapper;
}());
exports.PrismaQuestionDetailsMapper = PrismaQuestionDetailsMapper;
